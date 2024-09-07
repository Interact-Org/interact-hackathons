import PrimaryButton from '@/components/buttons/primary_btn';
import Input from '@/components/form/input';
import ModalWrapper from '@/wrappers/modal';
import React, { useState } from 'react';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  submitHandler: (formData: any) => void;
  hackathonID: string;
}

const CreateTeam = ({ setShow, submitHandler, hackathonID }: Props) => {
  const [title, setTitle] = useState('');
  return (
    <ModalWrapper setShow={setShow}>
      <Input val={title} setVal={setTitle} maxLength={25} />
      <PrimaryButton label="Create Team" onClick={() => submitHandler({ title, hackathonID })} />
    </ModalWrapper>
  );
};

export default CreateTeam;
