import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import getHandler from '@/handlers/get_handler';
import postHandler from '@/handlers/post_handler';
import { useDispatch } from 'react-redux';
import { setFigmaUsername, userSelector } from '@/slices/userSlice';
import { useSelector } from 'react-redux';
import { SERVER_ERROR } from '@/config/errors';
import { BACKEND_URL } from '@/config/routes';
import { useRouter } from 'next/router';
import { FigmaFile, HackathonTeam } from '@/types';
import Loader from '@/components/common/loader';
import { useMemo } from 'react';
import isURL from 'validator/lib/isURL';
import Link from 'next/link';
import Toaster from '@/utils/toaster';
import deleteHandler from '@/handlers/delete_handler';
import { Trash } from '@phosphor-icons/react';

interface FigmaComponentProps {
  team: HackathonTeam;
}

const FigmaComponent: React.FC<FigmaComponentProps> = ({ team }) => {
  const [error, setError] = useState<string | null>(null);
  const [figmaFiles, setFigmaFiles] = useState<FigmaFile[]>([]);
  const [newFigmaFiles, setNewFigmaFiles] = useState<string[]>(['']);
  const [loading, setLoading] = useState<boolean>(true);

  const user = useSelector(userSelector);

  const handleAddInput = () => {
    setNewFigmaFiles([...newFigmaFiles, '']);
  };

  const handleRemoveInput = (index: number) => {
    const updatedFiles = newFigmaFiles.filter((_, i) => i !== index);
    setNewFigmaFiles(updatedFiles);
  };

  const handleInputChange = (index: number, value: string) => {
    const updatedFiles = newFigmaFiles.map((file, i) => (i === index ? value : file));
    setNewFigmaFiles(updatedFiles);
  };

  const isValid = useMemo(() => newFigmaFiles.every(repo => isURL(repo)), [newFigmaFiles]);

  const handleSaveFigmaFiles = async () => {
    try {
      const URL = `/hackathons/${team.hackathonID}/participants/teams/${team.id}/project/figma?projectID=${
        team.projectID
      }&file_urls=${newFigmaFiles.join(',')}`;
      const body = {};
      const res = await postHandler(URL, body);
      if (res.statusCode == 201) {
        setFigmaFiles(prev => [...prev, ...(res.data.figmaFiles || [])]);
      }
      setLoading(false);
    } catch (error) {
      setError('Failed to save repositories');
      setLoading(false);
    }
    setNewFigmaFiles(['']);
  };

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get('status');
    const username = new URLSearchParams(window.location.search).get('username');
    const message = new URLSearchParams(window.location.search).get('message');

    if (status || message) {
      const { query } = router;

      if (status) {
        if (status && status == '1') {
          if (username && username != '') {
            Toaster.success('Synced with Figma');
            dispatch(setFigmaUsername(username));
          }
        } else if (status && status == '0') {
          if (message) {
            Toaster.error(message);
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

  const handleFigmaLogin = async () => {
    try {
      const URL = `${BACKEND_URL}/auth/figma?token=${Cookies.get('token')}`;
      window.location.assign(URL);
    } catch (err) {
      setError('Failed to save links');
    }
  };

  const handleFigmaDelete = async (repo: string) => {
    try {
      const URL = `/hackathons/${team.hackathonID}/participants/teams/${team.id}/project/figma/${repo}?fileID=${repo}`;
      const res = await deleteHandler(URL, { projectID: team.projectID });
      if (res.statusCode == 200) {
        setFigmaFiles(figmaFiles.filter(r => r.id != repo));
        Toaster.success('Repository deleted successfully');
      } else {
        console.log(res.data);
        Toaster.error('Failed to delete repository  ' + res.data.message);
      }
    } catch (err) {
      setError('Failed to delete repository');
    }
  };

  useEffect(() => {
    const fetchFigmaLinks = async () => {
      try {
        const URL = `/hackathons/${team.hackathonID}/participants/connections/${team.id}`;
        const res = await getHandler(URL);
        if (res.statusCode == 200) {
          setFigmaFiles(res.data.figmaFiles);
          console.log(res.data.figmaFiles);
        } else {
          if (res.data.message) setError(res.data.message);
          else setError(SERVER_ERROR);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch links');
        setLoading(false);
      }
    };

    fetchFigmaLinks();
  }, [team.hackathonID, team.id]);

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
      {user.figmaUsername ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Figma Files</h2>
          <ul className="list-disc space-y-2">
            {figmaFiles.map((file, index) => (
              <li key={index} className="flex items-center">
                <Link
                  href={file.fileURL}
                  target="_blank"
                  key={index}
                  className="w-fit h-8 py-2 px-3 rounded-lg flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm"
                >
                  <span className="text-blue-500 dark:text-blue-400 font-semibold">{file.fileURL}</span>
                </Link>
                <Trash className="h-5 w-5 ml-2 text-red-500 cursor-pointer" onClick={() => handleFigmaDelete(file.id)} />
              </li>
            ))}
          </ul>
          <div className="mt-4">
            {newFigmaFiles.map((file, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={file}
                  onChange={e => handleInputChange(index, e.target.value)}
                  className="border p-2 rounded mr-2 w-full"
                  placeholder="Enter Figma file URL"
                />
                <button onClick={() => handleRemoveInput(index)} className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-700">
                  Remove
                </button>
              </div>
            ))}
            <div className="w-full flex items-center justify-between">
              <button onClick={handleAddInput} className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-700 mt-2">
                New Link
              </button>
              {newFigmaFiles && newFigmaFiles.length > 0 && (
                <div className="group">
                  <button
                    disabled={!isValid}
                    onClick={handleSaveFigmaFiles}
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
        </div>
      ) : (
        <button onClick={handleFigmaLogin} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
          Sync with Figma
        </button>
      )}
    </div>
  );
};

export default FigmaComponent;
