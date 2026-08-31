import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useCreateTeam from "@/features/teams/use-create-team";

/** Create-team form, opened from the "Create team" button on /onboarding/team. */
export function CreateTeamModal({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (teamId: string) => void;
}) {
  const { form, onSubmit, isPending } = useCreateTeam({
    onSuccess: (teamId) => {
      onOpenChange(false);
      onCreated(teamId);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 p-0">
        <DialogHeader>
          <DialogTitle>Create your team</DialogTitle>
          <DialogDescription>Give it a name. You can invite people once it exists.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
            <div>
              <label htmlFor="team-name" className="text-[11px] text-ink-3">
                Team name
              </label>
              <Input
                id="team-name"
                placeholder="e.g. Growth"
                aria-invalid={!!errors.name}
                disabled={isPending}
                className="mt-1.5"
                {...register("name")}
              />
              {errors.name && <p className="mt-1.5 text-[11px] text-destructive">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="team-description" className="text-[11px] text-ink-3">
                Description (optional)
              </label>
              <textarea
                id="team-description"
                rows={3}
                placeholder="What this team is for"
                disabled={isPending}
                className="mt-1.5 w-full resize-y rounded-panel border border-line bg-paper-2 px-2.5 py-2 text-[12.5px] text-ink outline-none placeholder:text-ink-4 focus:border-ring"
                {...register("description")}
              />
            </div>
          </DialogBody>

          <DialogFooter>
            <div className="flex items-center gap-4">
              <Button type="submit" disabled={!isValid || isPending}>
                {isPending ? "Creating..." : "Create team"}
              </Button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="text-[12px] font-semibold text-ink-3 hover:text-ink"
              >
                Cancel
              </button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
