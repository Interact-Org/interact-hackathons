import { ArrowSquareOut, CircleNotch, PencilSimple, Trash } from '@phosphor-icons/react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { teamDetailSchema, teamDetailType } from '@/schemas/teams';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
type sampleData = {
  teamName: string;
  project: string;
  track: string;
  members: string[];
  evaluationStatus: 'pending' | 'completed';
  scores: number;
  teamId: string;
};
interface Props {
  teamId: string;
  data: sampleData;
}
export default function TeamActions({ teamId, data }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const form = useForm<teamDetailType>({
    resolver: zodResolver(teamDetailSchema),
    defaultValues: {
      name: data?.teamName || '',
      project: data?.project || '',
      track: data?.track || '',
      scores: data?.scores || 0,
    },
  });

  async function handleDeleteTeam() {
    //delete team logic
    // set the isDeleting state as per loading state
  }
  async function handleDetailsChange(values: teamDetailType) {
    // handle details change logic
    //set the isUpdating state as per loading state
  }
  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger>
          <Trash size={26} className="text-red-600 hover:bg-red-600 hover:text-white p-1 rounded-sm  cursor-pointer" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="text-left">
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>This action cannot be undone. This will permanently delete this team account.</DialogDescription>
          </DialogHeader>
          <Button variant={'destructive'} disabled={isDeleting} onClick={handleDeleteTeam}>
            {isDeleting ? (
              <span className="flex items-center gap-2">
                <p>Deleting</p>
                <CircleNotch size={16} className="animate-spin" />
              </span>
            ) : (
              'Delete Team'
            )}
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger>
          <PencilSimple size={26} className=" hover:bg-primary_text hover:text-white p-1 rounded-sm cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="max-w-[50%]">
          <DialogHeader className="text-left">
            <DialogTitle>Edit Team Details</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleDetailsChange)} className="w-full lg:grid lg:grid-cols-2 gap-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mb-2 md:mb-4 lg:mb-0">
                    <FormLabel className="text-sm md:text-base font-semibold">Team Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter team name" className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="project"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mb-2 md:mb-4 lg:mb-0">
                    <FormLabel className="text-sm md:text-base font-semibold">Project Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter project name" className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="track"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mb-2 md:mb-4 lg:mb-0">
                    <FormLabel className="text-sm md:text-base font-semibold">Track</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter track name" className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="scores"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mb-2 md:mb-4 lg:mb-0">
                    <FormLabel className="text-sm md:text-base font-semibold">Scores</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter scores" className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className=" col-span-2" disabled={isUpdating}>
                {isUpdating ? (
                  <span className="flex items-center gap-2">
                    <p>Updating</p>
                    <CircleNotch size={16} className="animate-spin" />
                  </span>
                ) : (
                  'Update Details'
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ArrowSquareOut
        size={26}
        className="hover:bg-primary_text hover:text-white p-1 rounded-sm cursor-pointer"
        onClick={() => {
          router.push('/admin/live/' + teamId);
        }}
      />
    </div>
  );
}
