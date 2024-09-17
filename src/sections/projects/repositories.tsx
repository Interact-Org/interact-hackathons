import React, { useEffect, useMemo, useState } from 'react';
import getHandler from '@/handlers/get_handler';
import { GithubRepo, HackathonTeam } from '@/types';
import { SERVER_ERROR } from '@/config/errors';
import { useDispatch, useSelector } from 'react-redux';
import { setGithubUsername, userSelector } from '@/slices/userSlice';
import Cookies from 'js-cookie';
import { BACKEND_URL } from '@/config/routes';
import { useRouter } from 'next/router';
import isURL from 'validator/lib/isURL';
import Loader from '@/components/common/loader';
import Link from 'next/link';

interface RepositoriesComponentProps {
  team: HackathonTeam;
}

const RepositoriesComponent: React.FC<RepositoriesComponentProps> = ({ team }) => {
  const [githubRepos, setGithubRepos] = useState<GithubRepo[]>([]);
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
        } else {
          if (res.data.message) setError(res.data.message);
          else setError(SERVER_ERROR);
        }
        setLoading(false);
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

  const isValid = useMemo(() => newRepos.every(repo => isURL(repo)), [newRepos]);

  const handleSaveRepositories = async () => {
    try {
      const URL = `${BACKEND_URL}/auth/github/${team.id}?token=${Cookies.get('token')}&repo_links=${newRepos.join(',')}`;
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
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <ul className="list-disc pl-5">
        {githubRepos.map((repo, index) => (
          <li key={index}>
            <Link
              href={repo.repoLink}
              target="_blank"
              key={index}
              className="w-fit h-8 py-2 px-3 border-[1px] border-primary_btn dark:border-dark_primary_btn rounded-lg flex items-center gap-2"
            >
              {repo.repoName}
            </Link>
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
            <button onClick={() => handleRemoveInput(index)} className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-700">
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="w-full flex items-center justify-between">
        <button onClick={handleAddInput} className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-700 mt-2">
          New Link
        </button>
        {newRepos && newRepos.length > 0 && (
          <div className="group">
            <button
              disabled={!isValid}
              onClick={handleSaveRepositories}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300 hover:bg-blue-700 mt-4"
            >
              Link Selected Repositories
            </button>
            {!isValid && (
              <div className="w-full opacity-0 group-hover:opacity-100 text-center text-gray-500 text-xs mt-2 font-medium transition-ease-300">
                All repo links must be valid URLs
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RepositoriesComponent;
