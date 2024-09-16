import PrimaryButton from '@/components/buttons/primary_btn';
import { Input } from '@/components/ui/input';
import ModalWrapper from '@/wrappers/modal';
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sampleRoleData } from './create_team';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  submitHandler: (formData: any) => void;
}

const JoinTeam = ({ setShow, submitHandler }: Props) => {
  const [token, setToken] = useState('');
  const [role, setRole] = useState('');

  return (
    <ModalWrapper setShow={setShow} top="1/2">
      <div className="flex w-full flex-col gap-3">
        <h1 className="text-2xl font-semibold">Join a Team</h1>
        <Input
          value={token}
          onChange={e => {
            setToken(e.target.value);
          }}
          placeholder="Enter Team Code"
        />
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
          <PrimaryButton label="Join Team" onClick={() => submitHandler({ token, role })} width={'60'} />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default JoinTeam;
