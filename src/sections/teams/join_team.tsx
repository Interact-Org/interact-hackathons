import PrimaryButton from '@/components/buttons/primary_btn';
import Input from '@/components/form/input';
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
      <Input val={token} setVal={setToken} maxLength={25} />
      <PrimaryButton label="Join Team" onClick={() => submitHandler({ token })} />
    </ModalWrapper>
  );
};

export default JoinTeam;
