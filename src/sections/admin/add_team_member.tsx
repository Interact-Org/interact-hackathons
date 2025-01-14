import PrimaryButton from '@/components/buttons/primary_btn';
import { Input } from '@/components/ui/input';
import ModalWrapper from '@/wrappers/modal';
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sampleRoleData } from '../teams/create_team';
import { HackathonTeam } from '@/types';
import { useSelector } from 'react-redux';
import { currentHackathonSelector } from '@/slices/hackathonSlice';
import postHandler from '@/handlers/post_handler';
import Toaster from '@/utils/toaster';
import { SERVER_ERROR } from '@/config/errors';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  team: HackathonTeam;
}

const AddTeamMember = ({ setShow, team }: Props) => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  const hackathon = useSelector(currentHackathonSelector);

  const submitHandler = async () => {
    const formData = { username, role };
    const URL = `/org/${hackathon.organizationID}/hackathons/${hackathon.id}/team/${team.id}/add`;
    const res = await postHandler(URL, formData);
    if (res.statusCode == 200) {
      Toaster.success('User added to the team');
      setShow(false);
    } else {
      Toaster.error(res.data.message || SERVER_ERROR);
    }
  };

  return (
    <ModalWrapper setShow={setShow} top="1/2">
      <div className="flex w-full flex-col gap-3">
        <h1 className="text-2xl font-semibold">Add Member to Team: {team.title}</h1>
        <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter User's username" />
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
        <div className="w-full flex justify-center">
          <PrimaryButton label="Join Team" onClick={submitHandler} width={'60'} />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default AddTeamMember;
