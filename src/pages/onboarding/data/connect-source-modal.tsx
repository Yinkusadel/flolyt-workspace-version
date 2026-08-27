import { useState } from "react";
import { Plus } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { DatasourceDto } from "@/services/api/datasources/get-datasources";
import type { DatasourceConnectionFieldDto } from "@/services/api/datasources/get-datasource-connection-schema";
import useGetDatasourceConnectionSchema from "@/features/datasources/use-get-datasource-connection-schema";
import useTestDatasourceConnection from "@/features/datasources/use-test-datasource-connection";
import useConnectDatasource from "@/features/datasources/use-connect-datasource";
import { SourceLogo } from "@/pages/onboarding/data/source-card";

/**
 * Ported from the old dashboard's ConnectSourcesModal (src/pages/DataPlatform/connect-sources)
 * onto this app's Dialog primitives and datasource hooks. Same two-step shape: a details step
 * with a plain "Connect" CTA, then a credentials step whose fields come from
 * GET /{name}/connection-schema — Connect stays disabled until Test Connection succeeds.
 */
export function ConnectSourceModal({
  datasource,
  onClose,
  onConnected,
}: {
  datasource: DatasourceDto;
  onClose: () => void;
  onConnected: () => void;
}) {
  const [step, setStep] = useState<"details" | "credentials">("details");
  const [connectionName, setConnectionName] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { connectionSchema, isLoading: isLoadingSchema } = useGetDatasourceConnectionSchema(
    step === "credentials" ? datasource.name : ""
  );

  const { testConnectionAsync, isPending: isTesting, result: testResult } = useTestDatasourceConnection();
  const { connectAsync, isPending: isConnecting } = useConnectDatasource({
    onSuccess: onConnected,
  });

  const isTestSuccessful = testResult?.isSuccessful === true;

  const handleFieldChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    if (!connectionSchema) return false;

    const nextErrors: Record<string, string> = {};
    connectionSchema.requiredFields.forEach((field) => {
      if (!formData[field.fieldName]?.trim()) {
        nextErrors[field.fieldName] = `${field.displayName} is required`;
      }
    });
    if (!connectionName.trim()) nextErrors.connectionName = "Connection name is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleTest = async () => {
    if (!validate()) return;
    try {
      await testConnectionAsync({ datasourceName: datasource.name, configuration: formData });
    } catch {
      // toasted by the hook
    }
  };

  const handleConnect = async () => {
    if (!validate()) return;
    try {
      await connectAsync({ datasourceName: datasource.name, connectionName, configuration: formData });
    } catch {
      // toasted by the hook
    }
  };

  const renderField = (field: DatasourceConnectionFieldDto) => {
    const inputType = field.fieldType === "secret" ? "password" : field.fieldType === "number" ? "number" : "text";
    return (
      <div key={field.fieldName}>
        <label className="mb-1.5 block text-[11px] text-ink-3">{field.displayName}</label>
        <Input
          type={inputType}
          placeholder={field.placeholder ?? ""}
          value={formData[field.fieldName] ?? ""}
          onChange={(e) => handleFieldChange(field.fieldName, e.currentTarget.value)}
          aria-invalid={!!errors[field.fieldName]}
        />
        {field.helpText && <p className="mt-1 text-[10.5px] text-ink-4">{field.helpText}</p>}
        {errors[field.fieldName] && (
          <p className="mt-1 text-[10.5px] text-destructive">{errors[field.fieldName]}</p>
        )}
      </div>
    );
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="max-w-md gap-0 p-0"
      >
        {step === "details" && (
          <div className="flex flex-col items-center p-8 text-center">
            <div className="mb-5 flex size-14 items-center justify-center rounded-panel border border-line bg-paper-2">
              <SourceLogo name={datasource.name} className="size-6" />
            </div>
            <h2 className="text-[17px] font-semibold text-ink">{datasource.displayName}</h2>
            <p className="mt-2.5 text-[12px] text-ink-3">{datasource.description}</p>

            <Button type="button" onClick={() => setStep("credentials")} className="mt-6 gap-1.5 rounded-full px-5">
              <Plus className="size-4" />
              Connect
            </Button>
          </div>
        )}

        {step === "credentials" && (
          <div className="flex max-h-[80vh] flex-col overflow-hidden">
            <div className="flex items-center gap-3 border-b border-line bg-paper-2 p-5 pr-10">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-panel border border-line bg-paper">
                <SourceLogo name={datasource.name} className="size-4.5" />
              </div>
              <div>
                <h2 className="text-[14px] font-semibold text-ink">Connect {datasource.displayName}</h2>
                <p className="text-[11px] text-ink-4">Enter your credentials to authenticate</p>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              <div>
                <label className="mb-1.5 block text-[11px] text-ink-3">Connection name</label>
                <Input
                  value={connectionName}
                  onChange={(e) => {
                    setConnectionName(e.currentTarget.value);
                    setErrors((prev) => ({ ...prev, connectionName: "" }));
                  }}
                  placeholder="Production DB"
                  disabled={isLoadingSchema || isConnecting}
                  aria-invalid={!!errors.connectionName}
                />
                {errors.connectionName && (
                  <p className="mt-1 text-[10.5px] text-destructive">{errors.connectionName}</p>
                )}
              </div>

              {isLoadingSchema && (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-9 w-full" />
                  ))}
                </div>
              )}

              {!isLoadingSchema && connectionSchema && (
                <div className="space-y-4">
                  {connectionSchema.requiredFields.map(renderField)}
                  {connectionSchema.optionalFields.length > 0 && (
                    <div className="space-y-4 border-t border-line pt-4">
                      <p className="text-[10.5px] text-ink-4">Optional fields</p>
                      {connectionSchema.optionalFields.map(renderField)}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3 border-t border-line bg-paper-2 p-4">
              {testResult && (
                <div
                  className={
                    testResult.isSuccessful
                      ? "rounded-panel border border-teal-border bg-teal-bg px-3.5 py-2.5 text-[11.5px] text-teal"
                      : "rounded-panel border border-rose-border bg-rose-bg px-3.5 py-2.5 text-[11.5px] text-rose"
                  }
                >
                  {testResult.isSuccessful
                    ? `Connection successful${testResult.serverVersion ? ` (server ${testResult.serverVersion})` : ""}`
                    : testResult.errorMessage || "Connection failed"}
                </div>
              )}

              {!isTestSuccessful && (
                <p className="text-[10.5px] text-ink-4">Test your connection before connecting.</p>
              )}

              <div className="flex justify-end gap-2.5">
                <Button type="button" variant="outline" onClick={() => setStep("details")}>
                  Back
                </Button>
                <Button type="button" variant="secondary" onClick={handleTest} disabled={isTesting}>
                  {isTesting ? "Testing..." : "Test"}
                </Button>
                <Button type="button" onClick={handleConnect} disabled={!isTestSuccessful || isConnecting}>
                  {isConnecting ? "Connecting..." : "Connect"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
