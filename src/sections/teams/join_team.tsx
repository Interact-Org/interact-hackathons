import PrimaryButton from '@/components/buttons/primary_btn';
import { Input } from '@/components/ui/input';
// import Input from '@/components/form/input';
import ModalWrapper from '@/wrappers/modal';
import React, { useState } from 'react';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  submitHandler: (formData: any) => void;
}

const JoinTeam = ({ setShow, submitHandler }: Props) => {
  const [token, setToken] = useState('');
  return (
    <ModalWrapper setShow={setShow}>
      <div className="flex w-full flex-col gap-3">
        <h1 className="text-2xl font-semibold">Join a Team</h1>
        {/* <Input val={token} setVal={setToken} maxLength={25} /> */}
        <Input
          value={token}
          onChange={e => {
            setToken(e.target.value);
          }}
          placeholder="Enter Team Code"
        />
        <div className="w-full flex justify-center">
          <PrimaryButton label="Join Team" onClick={() => submitHandler({ token })} width={'60'} />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default JoinTeam;
