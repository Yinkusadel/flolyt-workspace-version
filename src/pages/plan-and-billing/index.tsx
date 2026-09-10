import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowDownRight, ArrowUpRight, ChevronLeft, ChevronRight, Loader2, Wallet as WalletIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { CreditOperationDto } from "@/services/api/ai-credits/get-credit-operations";
import { useGetWalletBalance } from "@/features/wallet/use-get-wallet-balance";
import { useGetWalletTransactions } from "@/features/wallet/use-get-wallet-transactions";
import { useTopupWallet } from "@/features/wallet/use-topup-wallet";
import { useGetCreditBalance } from "@/features/ai-credits/use-get-credit-balance";
import { useGetCreditPacks } from "@/features/ai-credits/use-get-credit-packs";
import { useGetCreditOperations } from "@/features/ai-credits/use-get-credit-operations";
import { usePurchaseCreditPack } from "@/features/ai-credits/use-purchase-credit-pack";

const EYEBROW_CLASS = "font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase";
const AMOUNT_PRESETS = [10000, 50000, 100000];
const TRANSACTIONS_PAGE_SIZE = 8;
const OPERATIONS_PREVIEW_COUNT = 4;

type PlanBillingTab = "overview" | "activity";
const PLAN_BILLING_TABS: { key: PlanBillingTab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "activity", label: "Activity" },
];

function formatMoney(amount: number, currency: string | undefined) {
  if (!currency) return amount.toLocaleString();
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toLocaleString()} ${currency}`;
  }
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <p className={EYEBROW_CLASS}>{children}</p>;
}

function TabBar({ active, onChange }: { active: PlanBillingTab; onChange: (tab: PlanBillingTab) => void }) {
  return (
    <div className="border-b border-line">
      <div className="flex items-center gap-1">
        {PLAN_BILLING_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={cn(
              "shrink-0 rounded-t-panel border-b-2 px-3 py-2.5 text-[11.5px] whitespace-nowrap",
              active === tab.key
                ? "border-ink font-semibold text-ink"
                : "border-transparent font-normal text-ink-3 hover:text-ink-2"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CostRow({ op }: { op: CreditOperationDto }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <div>
        <p className="text-[12px] font-medium text-ink">{op.displayName}</p>
        {op.description && <p className="text-[10.5px] text-ink-4">{op.description}</p>}
      </div>
      <p className="shrink-0 text-[12px] font-semibold text-ultra tabular-nums">{op.creditCost} credits</p>
    </div>
  );
}

function FundWalletSection({ walletCurrency }: { walletCurrency: string | undefined }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const { topup, isPending } = useTopupWallet();

  const numericAmount = amount ? Number(amount) : 0;

  const handleSubmit = () => {
    if (numericAmount <= 0 || isPending) return;
    topup({
      amount: numericAmount,
      currency: walletCurrency ?? null,
      description: description.trim() || null,
      // Sends the user right back to this page once the gateway's done with them.
      callbackUrl: `${window.location.origin}/plan-and-billing`,
    });
  };

  return (
    <div className="rounded-card border border-line bg-paper-2 p-4">
      <p className="text-[12.5px] font-semibold text-ink">Fund wallet</p>
      <p className="mt-1 text-[11px] text-ink-3">
        You'll be redirected to complete payment, then brought back here.
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {AMOUNT_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setAmount(String(preset))}
            className={cn(
              "rounded-control border px-2.5 py-1 text-[11px] font-medium transition-colors",
              Number(amount) === preset
                ? "border-ultra-border bg-ultra-bg text-ultra"
                : "border-line bg-paper text-ink-3 hover:text-ink"
            )}
          >
            {formatMoney(preset, walletCurrency)}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Input
          value={amount}
          onChange={(e) => setAmount(e.currentTarget.value.replace(/[^0-9]/g, ""))}
          placeholder="Enter amount"
          inputMode="numeric"
        />
        {walletCurrency && (
          <span className="shrink-0 rounded-control border border-line bg-paper px-2.5 py-1.5 text-[11px] font-medium text-ink-3">
            {walletCurrency}
          </span>
        )}
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
        placeholder="Note for this top-up (optional)"
        rows={2}
        className="mt-2.5 w-full resize-none rounded-panel border border-line bg-paper-2 px-2.5 py-2 text-[12px] text-ink outline-none placeholder:text-ink-4 focus-visible:border-ring"
      />

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={numericAmount <= 0 || isPending}
        className="mt-3 w-full"
      >
        {isPending ? (
          <>
            <Loader2 className="size-3.5 animate-spin" /> Redirecting…
          </>
        ) : (
          `Fund wallet ${amount ? `with ${formatMoney(numericAmount, walletCurrency)}` : ""}`
        )}
      </Button>
    </div>
  );
}

export default function PlanAndBillingRoute() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab: PlanBillingTab = searchParams.get("tab") === "activity" ? "activity" : "overview";
  const setActiveTab = (tab: PlanBillingTab) => {
    setSearchParams(tab === "overview" ? {} : { tab }, { replace: true });
  };

  const [showFundWallet, setShowFundWallet] = useState(false);
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [selectedPackName, setSelectedPackName] = useState<string | null>(null);
  const [showAllOperations, setShowAllOperations] = useState(false);

  const { data: walletBalance, isLoading: isWalletLoading } = useGetWalletBalance();
  const { data: transactionsData, isLoading: isTransactionsLoading } = useGetWalletTransactions({
    page: transactionsPage,
    pageSize: TRANSACTIONS_PAGE_SIZE,
  });
  const { data: creditBalance, isLoading: isCreditBalanceLoading } = useGetCreditBalance();
  const { data: creditPacksData, isLoading: isPacksLoading } = useGetCreditPacks();
  const { data: creditOperationsData, isLoading: isOperationsLoading } = useGetCreditOperations();
  const { purchasePack, isPending: isPurchasing } = usePurchaseCreditPack();

  const walletCurrency = walletBalance?.data.currency;
  const creditPacks = creditPacksData?.data ?? [];
  const creditOperations = creditOperationsData?.data ?? [];
  const transactions = transactionsData?.data ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Plan and billing</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Your wallet funds everything: monthly active users, messages sent, and AI credit usage.
        </p>
      </div>

      <TabBar active={activeTab} onChange={setActiveTab} />

      {activeTab === "overview" && (
        <div className="space-y-8">
      {/* Wallet balance */}
      <section className="space-y-3">
        <SectionHeading>Wallet</SectionHeading>

        <div className="relative overflow-hidden rounded-card border border-line bg-paper-2 p-6">
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 right-0 size-48 -translate-y-1/3 translate-x-1/3 rounded-full bg-ultra/10 blur-3xl"
          />
          <div className="relative flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className={EYEBROW_CLASS}>Available balance</p>
              {isWalletLoading ? (
                <Skeleton className="mt-2 h-9 w-32 rounded-panel" />
              ) : (
                <p className="mt-1.5 text-[32px] font-semibold tracking-tight text-ink tabular-nums">
                  {formatMoney(walletBalance?.data.balance ?? 0, walletCurrency)}
                </p>
              )}
            </div>
            <Button
              type="button"
              onClick={() => setShowFundWallet((prev) => !prev)}
              disabled={isWalletLoading}
            >
              <WalletIcon className="size-3.5" />
              Fund wallet
            </Button>
          </div>
        </div>

        {showFundWallet && <FundWalletSection walletCurrency={walletCurrency} />}
      </section>

      {/* AI credits */}
      <section className="space-y-3">
        <SectionHeading>AI credits</SectionHeading>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-card border border-line bg-paper-2 p-4">
            <p className="text-[10.5px] text-ink-4">Available</p>
            <p className="mt-1 text-[22px] font-semibold text-ink tabular-nums">
              {isCreditBalanceLoading ? "…" : (creditBalance?.data.totalAvailable ?? 0)}
            </p>
          </div>
          <div className="rounded-card border border-line bg-paper-2 p-4">
            <p className="text-[10.5px] text-ink-4">Free monthly credits</p>
            <p className="mt-1 text-[22px] font-semibold text-ink tabular-nums">
              {isCreditBalanceLoading ? "…" : (creditBalance?.data.monthlyFreeLimit ?? 0)}
            </p>
          </div>
          <div className="rounded-card border border-line bg-paper-2 p-4">
            <p className="text-[10.5px] text-ink-4">Daily limit</p>
            <p className="mt-1 text-[22px] font-semibold text-ink tabular-nums">
              {isCreditBalanceLoading ? "…" : (creditBalance?.data.dailyFreeLimit ?? 0)}
            </p>
          </div>
        </div>
      </section>

      {/* Buy a credit pack */}
      <section className="space-y-3">
        <SectionHeading>Buy a credit pack</SectionHeading>

        {isPacksLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[1, 2, 3].map((key) => (
              <Skeleton key={key} className="h-36 rounded-card" />
            ))}
          </div>
        ) : creditPacks.length === 0 ? (
          <p className="text-[11.5px] text-ink-3">No credit packs available right now.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {creditPacks.map((pack) => (
                <button
                  key={pack.name}
                  type="button"
                  onClick={() => setSelectedPackName(pack.name)}
                  className={cn(
                    "flex flex-col items-start rounded-card border p-4 text-left transition-colors",
                    selectedPackName === pack.name
                      ? "border-ultra-border bg-ultra-bg"
                      : "border-line bg-paper-2 hover:border-ink-4"
                  )}
                >
                  <p className="text-[11px] font-medium text-ink-3">{pack.displayName}</p>
                  <p className="mt-1 text-[22px] font-semibold text-ink tabular-nums">
                    {pack.credits.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-ink-4">credits</p>
                  {pack.price && (
                    <>
                      <p className="mt-2 text-[13px] font-semibold text-ink">
                        {formatMoney(pack.price.amount, pack.price.currency)}
                      </p>
                      <p className="text-[10px] text-ink-4">
                        {formatMoney(pack.price.costPerCredit, pack.price.currency)} per credit
                      </p>
                    </>
                  )}
                </button>
              ))}
            </div>

            <Button
              type="button"
              onClick={() => selectedPackName && purchasePack({ packName: selectedPackName })}
              disabled={!selectedPackName || isPurchasing}
            >
              {isPurchasing ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" /> Purchasing…
                </>
              ) : (
                "Purchase selected pack"
              )}
            </Button>
          </>
        )}
      </section>

      {/* Cost schedule */}
      <section className="space-y-3">
        <SectionHeading>What costs credits</SectionHeading>

        <div className="divide-y divide-line rounded-card border border-line bg-paper-2">
          {isOperationsLoading ? (
            <div className="p-4">
              <Skeleton className="h-5 w-2/3 rounded-panel" />
            </div>
          ) : creditOperations.length === 0 ? (
            <p className="p-4 text-[11.5px] text-ink-3">No operation costs published yet.</p>
          ) : (
            creditOperations.slice(0, OPERATIONS_PREVIEW_COUNT).map((op) => <CostRow key={op.name} op={op} />)
          )}
        </div>

        {creditOperations.length > OPERATIONS_PREVIEW_COUNT && (
          <button
            type="button"
            onClick={() => setShowAllOperations(true)}
            className="text-[11.5px] font-semibold text-ultra hover:underline"
          >
            View all {creditOperations.length}
          </button>
        )}
      </section>

      <Dialog open={showAllOperations} onOpenChange={setShowAllOperations}>
        <DialogContent className="max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>What costs credits</DialogTitle>
          </DialogHeader>
          <DialogBody className="p-0">
            <div className="divide-y divide-line">
              {creditOperations.map((op) => (
                <CostRow key={op.name} op={op} />
              ))}
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
        </div>
      )}

      {activeTab === "activity" && (
      <section className="space-y-3">
        <SectionHeading>Recent wallet activity</SectionHeading>

        <div className="divide-y divide-line rounded-card border border-line bg-paper-2">
          {isTransactionsLoading ? (
            <div className="space-y-2 p-4">
              <Skeleton className="h-10 rounded-panel" />
              <Skeleton className="h-10 rounded-panel" />
            </div>
          ) : transactions.length === 0 ? (
            <p className="p-4 text-[11.5px] text-ink-3">No wallet activity yet.</p>
          ) : (
            transactions.map((tx) => {
              const isCredit = tx.transactionType.toLowerCase() === "credit";
              const numericAmount = Number(tx.amount.replace(/[^0-9.-]+/g, ""));
              return (
                <div key={tx.id} className="flex items-center gap-3 px-4 py-3">
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full",
                      isCredit ? "bg-teal-bg text-teal" : "bg-rose-bg text-rose"
                    )}
                  >
                    {isCredit ? <ArrowDownRight className="size-4" /> : <ArrowUpRight className="size-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium text-ink">{tx.description}</p>
                    <p className="text-[10.5px] text-ink-4">
                      {new Date(tx.transactionDate).toLocaleString()}
                    </p>
                  </div>
                  <p
                    className={cn(
                      "shrink-0 text-[12.5px] font-semibold tabular-nums",
                      isCredit ? "text-teal" : "text-rose"
                    )}
                  >
                    {isCredit ? "+" : "-"}
                    {formatMoney(Math.abs(numericAmount), walletCurrency)}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {transactionsData && transactionsData.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-[10.5px] text-ink-4">
              Page {transactionsData.currentPage} of {transactionsData.totalPages}
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                disabled={!transactionsData.hasPreviousPage}
                onClick={() => setTransactionsPage((p) => p - 1)}
              >
                <ChevronLeft className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                disabled={!transactionsData.hasNextPage}
                onClick={() => setTransactionsPage((p) => p + 1)}
              >
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </section>
      )}
    </div>
  );
}
