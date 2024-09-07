import { ChangeEvent, KeyboardEvent, useState } from 'react';

interface Props {
  sentences: string[];
  setSentences: React.Dispatch<React.SetStateAction<string[]>>;
  maxSentences?: number;
}

const Sentences = ({ sentences, setSentences, maxSentences = 5 }: Props) => {
  const [sentenceInput, setSentenceInput] = useState('');

  const handleSentenceInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSentenceInput(event.target.value);
  };

  const handleSentenceInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (sentences.length == maxSentences) return;
      const newSentence = sentenceInput.trim();
      if (!sentences.includes(newSentence) && newSentence !== '') {
        setSentences([...sentences, newSentence]);
        setSentenceInput('');
      }
    }
  };

  const handleSentenceRemove = (sentenceToRemove: string) => {
    setSentences(sentences.filter(sentence => sentence !== sentenceToRemove));
  };

  return (
    <div
      className={`w-full ${'p-2 bg-transparent border-primary_btn dark:border-dark_primary_btn'} border-[1px] flex flex-wrap items-center gap-2 rounded-md`}
    >
      {sentences.map(sentence => (
        <div
          key={sentence}
          className="flex justify-between items-center gap-2 text-sm bg-white p-3 py-2 rounded-lg cursor-default"
        >
          {sentence}
          <svg
            onClick={() => handleSentenceRemove(sentence)}
            className="w-6 h-6 cursor-pointer"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      ))}
      {sentences.length < maxSentences ? (
        <input
          type="text"
          className={`w-full text-sm border-[1px] bg-transparent border-transparent rounded-md px-3 py-2 outline-none`}
          maxLength={250}
          placeholder="Type Here"
          value={sentenceInput}
          onChange={handleSentenceInputChange}
          onKeyDown={handleSentenceInputKeyDown}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Sentences;
