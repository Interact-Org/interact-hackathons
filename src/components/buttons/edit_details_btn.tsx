import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PencilSimple, Plus, Trash, TrashSimple } from '@phosphor-icons/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRoundSchema, createRoundType } from '@/schemas/teams';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import Checkbox from '../form/checkbox';
import { HackathonRound, HackathonRoundScoreMetric } from '@/types';
import TextArea from '../form/textarea';
import Select from '../form/select';
import { useSelector } from 'react-redux';
import { currentHackathonSelector } from '@/slices/hackathonSlice';
import { SERVER_ERROR } from '@/config/errors';
import postHandler from '@/handlers/post_handler';
import Toaster from '@/utils/toaster';
import deleteHandler from '@/handlers/delete_handler';
import { getInputFieldFormatTime } from '@/utils/funcs/time';

const EditDetailsBtn = ({ rounds }: { rounds: HackathonRound[] }) => {
  const [metrics, setMetrics] = useState<HackathonRoundScoreMetric[]>([]);
  const hackathon = useSelector(currentHackathonSelector);

  const form = useForm<createRoundType>({
    resolver: zodResolver(createRoundSchema),
  });

  async function handleRoundCreation(values: createRoundType) {
    const data = {
      ...values,
      metrics,
      isIdeation: isIdeationRound,
    };
    const URL = `/org/${hackathon.organizationID}/hackathons/${hackathon.id}/round`;
    const res = await postHandler(URL, data);
    if (res.statusCode == 200) {
      console.log(res.data);
    } else {
      Toaster.error(res.data.message || SERVER_ERROR);
    }
  }

  async function handleDeleteRound(id: string) {
    const URL = `/org/${hackathon.organizationID}/hackathons/round/${id}`;
    const res = await deleteHandler(URL);
  }

  const addMetric = () => {
    setMetrics((prev: HackathonRoundScoreMetric[]) => [...prev, { id: '', hackathonRoundID: '', title: '', type: '', options: [] }]);
  };
  const deleteMetric = (index: number) => {
    setMetrics((prev: HackathonRoundScoreMetric[]) => prev.filter((_, i) => i !== index));
  };
  const updateMetric = (index: number, key: string, value: any) => {
    setMetrics((prev: HackathonRoundScoreMetric[]) => prev.map((metric, idx) => (idx === index ? { ...metric, [key]: value } : metric)));
  };

  const [isIdeationRound, setIsIdeationRound] = useState(false);

  return (
    <Dialog>
      <DialogTrigger className="text-sm  flex items-center rounded-md bg-white hover:bg-slate-100 text-primary_text px-8 py-2 gap-3">
        <p>Edit Details</p>
        <PencilSimple size={18} />
      </DialogTrigger>
      <DialogContent className="min-w-[50%]">
        <DialogHeader className="text-left">
          <DialogTitle>Edit Hackathon Details</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <Table>
            <TableCaption>Hackathon rounds data</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Judging start time</TableHead>
                <TableHead>Judging end time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rounds.map((round, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{round.title}</TableCell>
                  <TableCell>{round.startTime.toLocaleString()}</TableCell>
                  <TableCell>{round.endTime.toLocaleString()}</TableCell>
                  <TableCell>{round.judgingStartTime.toLocaleString()}</TableCell>
                  <TableCell>{round.judgingEndTime.toLocaleString()}</TableCell>
                  <TableCell>
                    <EditRoundBtn roundData={round} />
                    <Button
                      variant={'destructive'}
                      onClick={() => {
                        handleDeleteRound(round.id);
                      }}
                    >
                      <Trash size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell colSpan={6}>
                  <Dialog>
                    <DialogTrigger className="w-full">
                      <div className="flex items-center w-full justify-center gap-3 cursor-pointer">
                        <Plus size={16} />
                        <p>Create new round</p>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="min-w-[50%] max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create new round</DialogTitle>
                      </DialogHeader>
                      <div className="w-full">
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(handleRoundCreation)} className="w-full lg:grid lg:grid-cols-2 gap-4 mb-12">
                            <FormField
                              name="title"
                              control={form.control}
                              render={({ field }) => (
                                <FormItem className="w-full col-span-2">
                                  <FormLabel className="text-sm md:text-base font-semibold">Round Title</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Enter title" className="bg-white w-full" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              name="startTime"
                              control={form.control}
                              render={({ field }) => (
                                <FormItem className="w-full">
                                  <FormLabel className="text-sm md:text-base font-semibold">Start Time</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="datetime-local" className="bg-white w-full" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              name="endTime"
                              control={form.control}
                              render={({ field }) => (
                                <FormItem className="w-full">
                                  <FormLabel className="text-sm md:text-base font-semibold">End Time</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="datetime-local" className="bg-white w-full" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              name="judgingStartTime"
                              control={form.control}
                              render={({ field }) => (
                                <FormItem className="w-full">
                                  <FormLabel className="text-sm md:text-base font-semibold">Judging Start Time</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="datetime-local" className="bg-white w-full" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              name="judgingEndTime"
                              control={form.control}
                              render={({ field }) => (
                                <FormItem className="w-full">
                                  <FormLabel className="text-sm md:text-base font-semibold">Judging End Time</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="datetime-local" className="bg-white w-full" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="flex items-center gap-4 col-span-2">
                              <Checkbox label="Is Ideation Round?" val={isIdeationRound} setVal={setIsIdeationRound} border={false} />
                            </div>
                            <div className="flex w-full flex-col gap-4 mt-8">
                              {metrics.map((metric, idx) => (
                                <div
                                  key={idx}
                                  className="flex flex-col gap-2 border-[1px] border-[#dedede] rounded-lg rounded-tl-none p-2 relative my-4"
                                >
                                  <div className="bg-primary_text text-white text-sm px-3 py-1 rounded-t-md w-fit absolute -top-8 left-0 h-8 flex items-center gap-3">
                                    <p>{metric.title || `Metric ${idx + 1}`}</p>{' '}
                                    <TrashSimple
                                      className="cursor-pointer text-red-500 bg-white p-1 rounded-md "
                                      size={24}
                                      onClick={() => deleteMetric(idx)}
                                    />
                                  </div>
                                  <Input
                                    onChange={e => {
                                      updateMetric(idx, 'title', e.target.value);
                                    }}
                                    placeholder="Metric Title"
                                  />
                                  <TextArea
                                    label="Metric Description"
                                    val={metric.description || ''}
                                    setVal={val => updateMetric(idx, 'description', val)}
                                    maxLength={250}
                                  />
                                  <Select
                                    label="Metric Type"
                                    options={['text', 'number', 'select', 'boolean']}
                                    val={metric.type}
                                    setVal={(val: any) => updateMetric(idx, 'type', val)}
                                  />
                                  {metric.type === 'select' && (
                                    <TextArea
                                      label="Options (comma separated)"
                                      val={metric.options?.join(', ') || ''}
                                      setVal={val =>
                                        updateMetric(
                                          idx,
                                          'options',
                                          (val as string).split(',').map(opt => opt.trim())
                                        )
                                      }
                                      maxLength={250}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                            <Button className="w-full bg-primary_text/90 hover:bg-primary_text text-white" onClick={addMetric} type="button">
                              Add Metric
                            </Button>{' '}
                            <Button type="submit" className="w-full">
                              Add Round
                            </Button>
                          </form>
                        </Form>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditDetailsBtn;

function EditRoundBtn({ roundData }: { roundData: HackathonRound }) {
  const form = useForm<createRoundType>({
    resolver: zodResolver(createRoundSchema),
    defaultValues: {
      title: roundData.title || '',
      startTime: getInputFieldFormatTime(roundData.startTime),
      endTime: getInputFieldFormatTime(roundData.endTime),
      judgingStartTime: getInputFieldFormatTime(roundData.judgingStartTime),
      judgingEndTime: getInputFieldFormatTime(roundData.judgingEndTime),
    },
  });

  async function handleRoundEdit() {
    //code
  }

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <div className="p-2 w-fit">
            <PencilSimple size={16} />
          </div>
        </DialogTrigger>
        <DialogContent className="min-w-[50%] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit round</DialogTitle>
          </DialogHeader>
          <div className="w-full">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleRoundEdit)} className="w-full lg:grid lg:grid-cols-2 gap-4 mb-12">
                <FormField
                  name="title"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full col-span-2">
                      <FormLabel className="text-sm md:text-base font-semibold">Round Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter team name" className="bg-white w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="startTime"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-sm md:text-base font-semibold">Start Time</FormLabel>
                      <FormControl>
                        <Input {...field} type="datetime-local" className="bg-white w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="endTime"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-sm md:text-base font-semibold">End Time</FormLabel>
                      <FormControl>
                        <Input {...field} type="datetime-local" className="bg-white w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="judgingStartTime"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-sm md:text-base font-semibold">Judging Start Time</FormLabel>
                      <FormControl>
                        <Input {...field} type="datetime-local" className="bg-white w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="judgingEndTime"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-sm md:text-base font-semibold">Judging End Time</FormLabel>
                      <FormControl>
                        <Input {...field} type="datetime-local" className="bg-white w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full col-span-2">
                  Apply Changes
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
