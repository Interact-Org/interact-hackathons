import React, { useEffect, useState } from 'react';
import getHandler from '@/handlers/get_handler';
import { HackathonTeam } from '@/types';
import { SERVER_ERROR } from '@/config/errors';
import { useDispatch, useSelector } from 'react-redux';
import { setGithubUsername, userSelector } from '@/slices/userSlice';
import Cookies from 'js-cookie';
import { BACKEND_URL } from '@/config/routes';
import { useRouter } from 'next/router';

interface RepositoriesComponentProps {
  team: HackathonTeam;
}

const RepositoriesComponent: React.FC<RepositoriesComponentProps> = ({ team }) => {
  const [githubRepos, setGithubRepos] = useState<string[]>([]);
  const [newRepos, setNewRepos] = useState<string[]>(['']);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const URL = `/hackathons/${team.hackathonID}/participants/connections/${team.id}`;
        const res = await getHandler(URL);
        if (res.statusCode == 200) {
          setGithubRepos(res.data.githubRepos);
          setLoading(false);
        } else {
          if (res.data.message) setError(res.data.message);
          else setError(SERVER_ERROR);
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to fetch repositories');
        setLoading(false);
      }
    };

    fetchRepositories();
  }, [team.hackathonID, team.id]);

  const handleAddInput = () => {
    setNewRepos([...newRepos, '']);
  };

  const handleRemoveInput = (index: number) => {
    const updatedRepos = newRepos.filter((_, i) => i !== index);
    setNewRepos(updatedRepos);
  };

  const handleInputChange = (index: number, value: string) => {
    const updatedRepos = newRepos.map((repo, i) => (i === index ? value : repo));
    setNewRepos(updatedRepos);
  };

  const handleSaveRepositories = async () => {
    try {
      const URL = `${BACKEND_URL}/auth/github?token=${Cookies.get('token')}&repo_links=${newRepos.join(',')}`;
      window.location.assign(URL);
    } catch (err) {
      setError('Failed to save repositories');
    }
  };

  const router = useRouter();

  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get('status');
    const username = new URLSearchParams(window.location.search).get('username');
    const message = new URLSearchParams(window.location.search).get('message');

    if (status || message) {
      const { query } = router;

      if (status) {
        if (status && status == '1') {
          if (username && username != '') dispatch(setGithubUsername(username));
        } else if (status && status == '0') {
          if (message) {
            delete query.message;
          }
        }
        delete query.status;
      }

      router.replace({
        pathname: router.pathname,
        query: { ...query },
      });
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">GitHub Repositories</h2>
      <ul className="list-disc pl-5">
        {githubRepos.map((repo, index) => (
          <li key={index}>
            <a href={repo} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {repo}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        {newRepos.map((repo, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={repo}
              onChange={e => handleInputChange(index, e.target.value)}
              className="border p-2 rounded mr-2 w-full"
              placeholder="Enter GitHub repository URL"
            />
            <button onClick={() => handleRemoveInput(index)} className="bg-red-500 text-white p-2 rounded hover:bg-red-700">
              -
            </button>
          </div>
        ))}
        <button onClick={handleAddInput} className="bg-green-500 text-white p-2 rounded hover:bg-green-700 mt-2">
          +
        </button>
      </div>
      <button onClick={handleSaveRepositories} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 mt-4">
        Link Repositories
      </button>
    </div>
  );
};

export default RepositoriesComponent;
