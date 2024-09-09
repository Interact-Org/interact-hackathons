import { Input } from '@/components/ui/input';
import { HackathonRound, HackathonRoundScoreMetric, HackathonRoundTeamScoreCard } from '@/types';
import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TextArea from '@/components/form/textarea';
import { useSelector } from 'react-redux';
import { currentHackathonSelector } from '@/slices/hackathonSlice';
import { ORG_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import { SERVER_ERROR } from '@/config/errors';
import postHandler from '@/handlers/post_handler';

const TeamScores = ({ teamID }: { teamID: string }) => {
  const [activeRound, setActiveRound] = useState(0);
  const [rounds, setRounds] = useState<HackathonRound[]>([]);
  const [scores, setScores] = useState<HackathonRoundTeamScoreCard[]>([]);
  const hackathon = useSelector(currentHackathonSelector);

  const getRounds = async () => {
    const URL = `${ORG_URL}/${hackathon.organizationID}/hackathons/${hackathon.id}/rounds`;
    const res = await getHandler(URL);
    if (res.statusCode === 200) {
      setRounds(res.data.rounds);
    } else {
      Toaster.error(res.data?.message || SERVER_ERROR);
    }
  };

  useEffect(() => {
    getRounds();
    getScores();
  }, []);

  const [inputScores, setInputScores] = useState<{ [key: string]: any }>({});

  const handleInputChange = (id: string, value: any) => {
    setInputScores(prevScores => ({
      ...prevScores,
      [id]: value,
    }));
  };

  const getScores = async () => {
    const URL = `${ORG_URL}/${hackathon.organizationID}/hackathons/${hackathon.id}/score/${teamID}`;
    const res = await getHandler(URL);
    if (res.statusCode === 200) {
      setScores(res.data.scores);
    } else {
      Toaster.error(res.data?.message || SERVER_ERROR);
    }
  };

  useEffect(() => {
    const currentRound = scores[activeRound];
    if (currentRound) {
      if (currentRound.overallScore) handleInputChange('overallScore', currentRound.overallScore);
      currentRound.scores?.map(metric => {
        handleInputChange(metric.hackathonRoundScoreMetricID, metric.score);
      });
    }
  }, [scores, activeRound]);

  const handleSubmit = async (hackathonRoundID: string, score: string | number | boolean, hackathonRoundScoreMetricID?: string) => {
    const formData = {
      hackathonRoundID,
      hackathonTeamID: teamID,
      hackathonRoundScoreMetricID,
      score: String(score),
    };

    const URL = `${ORG_URL}/${hackathon.organizationID}/hackathons/${hackathon.id}/score`;
    const res = await postHandler(URL, formData);
    if (res.statusCode === 200) {
      Toaster.success('Score Updated');
    } else {
      Toaster.error(res.data?.message || SERVER_ERROR);
    }
  };

  return (
    <div className="w-full p-4 flex flex-col gap-8">
      <div className="w-fit bg-white p-1 rounded-md mx-auto">
        {Array.from({ length: rounds.length }, (_, index) => (
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
        {rounds[activeRound]?.metrics.map((metric, index) => (
          <div key={index} className="w-full p-3 bg-white rounded-md flex flex-col gap-2">
            <span>
              <h1 className="text-2xl font-semibold">{metric.title}</h1>
              <p className="text-xs mb-4">{metric.description}</p>
            </span>

            {metric.type === 'number' && (
              <Input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter score"
                value={Number(inputScores[metric.id]) || ''}
                onChange={e => handleInputChange(metric.id, e.target.value)}
              />
            )}

            {metric.type === 'text' && (
              <TextArea
                className="w-full p-2 border border-gray-300 rounded-md resize-none"
                placeholder="Enter judgement"
                maxLength={300}
                val={inputScores[metric.id] || ''}
                setVal={val => handleInputChange(metric.id, val)}
              />
            )}
            {metric.type === 'select' && metric.options && metric.options.length > 0 && (
              <Select onValueChange={value => handleInputChange(metric.id, value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Option" />
                </SelectTrigger>
                <SelectContent>
                  {metric.options.map((option, index) => (
                    <SelectItem key={index} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button
              onClick={() => handleSubmit(metric.hackathonRoundID, inputScores[metric.id], metric.id)}
              className="bg-primary_text/90 hover:bg-primary_text px-12"
            >
              Submit
            </Button>
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
            value={inputScores['overallScore'] || ''}
            onChange={e => handleInputChange('overallScore', e.target.value)}
          />
        </span>
        <Button
          onClick={() => handleSubmit(rounds[activeRound].id, inputScores['overallScore'])}
          className="bg-primary_text/90 hover:bg-primary_text px-12"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default TeamScores;
