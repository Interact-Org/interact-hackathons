import { Input } from '@/components/ui/input';
import { HackathonRoundScoreMetric } from '@/types';
import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TextArea from '@/components/form/textarea';

const TeamScores = () => {
  const [activeRound, setActiveRound] = useState(0);
  const rounds = 5;

  const [scores, setScores] = useState<{ [key: string]: any }>({});

  const handleInputChange = (id: string, value: any) => {
    setScores(prevScores => ({
      ...prevScores,
      [id]: value,
    }));
  };
  useEffect(() => {
    console.log(scores);
  }, [scores]);
  return (
    <div className="w-full p-4 flex flex-col gap-8">
      <div className="w-fit bg-white p-1 rounded-md mx-auto">
        {Array.from({ length: rounds }, (_, index) => (
          <button
            key={index}
            className={`px-6 py-1 text-sm font-semibold rounded-sm ${activeRound === index ? 'bg-blue-500 text-white' : 'bg-white'}`}
            onClick={() => setActiveRound(index)}
          >
            Round {index + 1}
          </button>
        ))}
      </div>

      <div className="w-full grid grid-cols-2 gap-4">
        {scoreMetricData.map((data, index) => (
          <div key={index} className="w-full p-3 bg-white rounded-md flex flex-col">
            <span>
              <h1 className="text-2xl font-semibold">{data.title}</h1>
              <p className="text-xs mb-4">{data.description}</p>
            </span>

            {data.type === 'number' && (
              <Input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter score"
                value={scores[data.title] || ''}
                onChange={e => handleInputChange(data.title, e.target.value)}
              />
            )}

            {data.type === 'text' && (
              <TextArea
                className="w-full p-2 border border-gray-300 rounded-md resize-none"
                placeholder="Enter judgement"
                maxLength={300}
                val={scores[data.title] || ''}
                setVal={val => handleInputChange(data.title, val)}
              />
            )}
            {data.type === 'select' && data.options && data.options.length > 0 && (
              <Select onValueChange={value => handleInputChange(data.title, value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Option" />
                </SelectTrigger>
                <SelectContent>
                  {data.options.map((option, index) => (
                    <SelectItem key={index} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        ))}
      </div>

      <div className="w-full p-3 bg-white text-primary_text rounded-md flex justify-between gap-4">
        <span className="flex items-center gap-2">
          <Trophy size={32} />
          <h1 className="text-3xl font-semibold text-nowrap">Overall Score</h1>
          <Input
            type="number"
            className="bg-white text-black w-60 ml-8"
            placeholder="Enter Score"
            value={scores['overallScore'] || ''}
            onChange={e => handleInputChange('overallScore', e.target.value)}
          />
        </span>
        <Button className="bg-primary_text/90 hover:bg-primary_text px-12">Submit</Button>
      </div>
    </div>
  );
};

export default TeamScores;

const scoreMetricData: HackathonRoundScoreMetric[] = [
  {
    hackathonRoundID: 'tech',
    title: 'Tech',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aperiam similique minus cumque culpa tenetur repellat veritatis inventore libero harum magni.',
    type: 'text',
  },
  {
    hackathonRoundID: 'design',
    title: 'Design',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aperiam similique minus cumque culpa tenetur repellat veritatis inventore libero harum magni.',
    type: 'select',
    options: ['Good', 'Average', 'Bad'],
  },
  {
    hackathonRoundID: 'presentation',
    title: 'Presentation',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aperiam similique minus cumque culpa tenetur repellat veritatis inventore libero harum magni.',
    type: 'number',
  },
  {
    hackathonRoundID: 'management',
    title: 'Management',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aperiam similique minus cumque culpa tenetur repellat veritatis inventore libero harum magni.',
    type: 'text',
  },
];
