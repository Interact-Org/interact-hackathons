import { User } from '@/types';
import { ClipboardText } from '@phosphor-icons/react';
import Link from 'next/link';
import React from 'react';
import Toaster from '../toaster';

const renderContentWithLinks = (caption: string, taggedUsers?: User[]) => {
  const codeBlockRegex = /```[\s\S]+?```/g;
  const taggedUsernames = (taggedUsers || []).map(u => u.username);

  const parts = caption.split(codeBlockRegex).reduce<string[]>((acc, part, index) => {
    acc.push(part);
    if (index !== caption.split(codeBlockRegex).length - 1) {
      const match = caption.match(codeBlockRegex);
      if (match) acc.push(match[index]);
    }
    return acc;
  }, []);

  return (
    <>
      {parts.map((part, partIndex) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const codeContent = part.slice(3, -3);
          return (
            <div key={partIndex} className="w-full relative group">
              <ClipboardText
                onClick={() => {
                  navigator.clipboard.writeText(codeContent.trim());
                  Toaster.success('Copied to Clipboard!');
                }}
                className="bg-white absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-ease-300 cursor-pointer"
                size={24}
                weight="duotone"
              />
              <pre className="w-full overflow-auto rounded-sm p-3 border-[1px] border-[#3636363f] border-dashed thin_scrollbar">
                <code>{codeContent.trim()}</code>
              </pre>
            </div>
          );
        }

        const lines = part.split('\n');

        return (
          <React.Fragment key={partIndex}>
            {lines.map((line, lineIndex) => {
              // First, split by bold
              const boldParts = line.split(/(\*\*[^*]+\*\*)/g);

              return (
                <div key={`${partIndex}-${lineIndex}`}>
                  {boldParts.map((boldPart, boldIndex) => {
                    if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
                      const boldContent = boldPart.slice(2, -2);

                      // Split bold content by italics
                      const italicParts = boldContent.split(/(\^\^[^^]+\^\^)/g);

                      return (
                        <b key={`${partIndex}-${lineIndex}-${boldIndex}`}>
                          {italicParts.map((italicPart, italicIndex) => {
                            if (italicPart.startsWith('^^') && italicPart.endsWith('^^')) {
                              const italicContent = italicPart.slice(2, -2);

                              return (
                                <i key={`${partIndex}-${lineIndex}-${boldIndex}-${italicIndex}`}>
                                  {italicContent.split(/\s+/).map((word, wordIndex) => (
                                    <Word key={wordIndex} word={word} taggedUsernames={taggedUsernames} />
                                  ))}
                                </i>
                              );
                            }

                            return italicPart
                              .split(/\s+/)
                              .map((word, wordIndex) => (
                                <Word key={wordIndex} word={word} taggedUsernames={taggedUsernames} />
                              ));
                          })}
                        </b>
                      );
                    }

                    // Split non-bold content by italics
                    const italicParts = boldPart.split(/(\^\^[^^]+\^\^)/g);

                    return italicParts.map((italicPart, italicIndex) => {
                      if (italicPart.startsWith('^^') && italicPart.endsWith('^^')) {
                        const italicContent = italicPart.slice(2, -2);

                        return (
                          <i key={`${partIndex}-${lineIndex}-${boldIndex}-${italicIndex}`}>
                            {italicContent.split(/\s+/).map((word, wordIndex) => (
                              <Word key={wordIndex} word={word} taggedUsernames={taggedUsernames} />
                            ))}
                          </i>
                        );
                      }

                      return italicPart
                        .split(/\s+/)
                        .map((word, wordIndex) => (
                          <Word key={wordIndex} word={word} taggedUsernames={taggedUsernames} />
                        ));
                    });
                  })}
                </div>
              );
            })}
          </React.Fragment>
        );
      })}
    </>
  );
};

interface WordProps {
  word: string;
  taggedUsernames: string[];
}

const Word: React.FC<WordProps> = ({ word, taggedUsernames }) => {
  // Check if the word is a link
  if (word.startsWith('http://') || word.startsWith('https://')) {
    return (
      <a
        href={word}
        className="underline underline-offset-2 hover:text-primary_text transition-ease-200"
        target="_blank"
        rel="noopener noreferrer"
      >
        {word.trim()}{' '}
      </a>
    );
  }

  // Check if the word is a tag
  if (word.startsWith('#')) {
    return (
      <Link
        href={`/explore?search=${word.replace('#', '')}`}
        className="font-medium hover:text-primary_text transition-ease-200"
        target="_blank"
      >
        {word}{' '}
      </Link>
    );
  }

  if (word.startsWith('@') && taggedUsernames.includes(word.replace('@', ''))) {
    return (
      <Link
        href={`/explore/user/${word.replace('@', '')}`}
        className="font-semibold hover:text-primary_text transition-ease-200"
        target="_blank"
      >
        {word}{' '}
      </Link>
    );
  }

  return <span>{word} </span>;
};

export default renderContentWithLinks;
