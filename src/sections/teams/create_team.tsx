import PrimaryButton from '@/components/buttons/primary_btn';
import { Input } from '@/components/ui/input';
import { HackathonTrack } from '@/types';
// import Input from '@/components/form/input';
import ModalWrapper from '@/wrappers/modal';
import { set } from 'nprogress';
import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Toaster from '@/utils/toaster';
interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  submitHandler: (formData: any) => void;
  hackathonID: string;
  tracks: HackathonTrack[];
}

const CreateTeam = ({ setShow, submitHandler, hackathonID, tracks }: Props) => {
  const [title, setTitle] = useState('');
  const [track, setTrack] = useState('');

  return (
    <ModalWrapper setShow={setShow}>
      <div className="w-full flex flex-col gap-3">
        <span>
          <h1 className="text-2xl font-semibold">Create new team</h1>
          <p className="text-black/70 text-sm">Fill in the details below to create a new team</p>
        </span>
        <Input
          value={title}
          onChange={e => {
            setTitle(e.target.value);
          }}
          placeholder="Enter Team Name"
        />
        <Select value={track} onValueChange={setTrack}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Track" />
          </SelectTrigger>
          <SelectContent>
            {tracks.map((track, index) => (
              <SelectItem value={track.id} key={index}>
                {track.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="w-full flex justify-center">
          <PrimaryButton
            label="Create Team"
            onClick={() => {
              if (title && track) {
                submitHandler({ title, trackID: track, hackathonID });
              } else {
                Toaster.error('Please fill in all the fields');
              }
            }}
            width={'60'}
          />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default CreateTeam;
