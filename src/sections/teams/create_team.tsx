import PrimaryButton from '@/components/buttons/primary_btn';
import { Input } from '@/components/ui/input';
import { HackathonTrack } from '@/types';
import ModalWrapper from '@/wrappers/modal';
import React, { useState } from 'react';
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
  const [role, setRole] = useState('');
  const [schoolOfTeamMembers, setSchoolOfTeamMembers] = useState('');
  const [facultyEmpID, setFacultyEmpID] = useState('');
  const [facultyName, setFacultyName] = useState('');
  const [facultySchool, setFacultySchool] = useState('');

  return (
    <ModalWrapper setShow={setShow} top="1/2">
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
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Your Role" />
          </SelectTrigger>
          <SelectContent>
            {sampleRoleData.map((role, index) => (
              <SelectItem value={role} key={index}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={schoolOfTeamMembers}
          onChange={e => {
            setSchoolOfTeamMembers(e.target.value);
          }}
          placeholder="Enter School of Team Members"
        />
        <Input
          value={facultyEmpID}
          onChange={e => {
            setFacultyEmpID(e.target.value);
          }}
          placeholder="Enter Faculty Employee ID"
        />
        <Input
          value={facultyName}
          onChange={e => {
            setFacultyName(e.target.value);
          }}
          placeholder="Enter Faculty Name"
        />
        <Input
          value={facultySchool}
          onChange={e => {
            setFacultySchool(e.target.value);
          }}
          placeholder="Enter Faculty School"
        />
        <div className="w-full flex justify-center">
          <PrimaryButton
            label="Create Team"
            onClick={() => {
              if (title && track && role && schoolOfTeamMembers && facultyEmpID && facultyName && facultySchool) {
                submitHandler({
                  title,
                  trackID: track,
                  hackathonID,
                  role,
                  schoolOfTeamMembers,
                  facultyEmpID,
                  facultyName,
                  facultySchool,
                });
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

export const sampleRoleData = [
  'Frontend Developer',
  'Backend Developer',
  'Machine Learning Engineer',
  'Designer',
  'Fullstack Developer',
  'Data Scientist',
  'UI/UX Designer',
  'DevOps Engineer',
  'Project Manager',
  'Product Manager',
  'Mobile Developer',
  'Cloud Engineer',
  'AI/ML Researcher',
  'QA Engineer',
  'Business Analyst',
  'Security Specialist',
  'Other',
];
