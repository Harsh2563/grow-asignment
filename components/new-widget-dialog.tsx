import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus as PlusIcon } from "lucide-react";

export const NewWidgetDialog = () => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white border-none rounded-md"
          >
            <PlusIcon className="h-4 w-4 mr-1.5" /> Add Widget
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Widget</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="widget-name">Widget Name</Label>
              <Input id="widget-name" name="widget-name" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="api-url">Api Url</Label>
              <Input id="api-url" name="widget-api-url" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="refresh-interval">
                Refresh Intervals (in seconds)
              </Label>
              <Input
                id="refresh-interval"
                type="number"
                name="widget-refresh-interval"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <PlusIcon className="h-4 w-4 mr-1.5" /> Add Widget
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
