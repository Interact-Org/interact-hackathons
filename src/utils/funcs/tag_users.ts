class TagUserUtils {
  public cursorPosition: number | null;
  public content: string;
  public showUsers: boolean;
  public taggedUsernames: string[];
  public setCursorPosition: React.Dispatch<React.SetStateAction<number | null>>;
  public setContent: React.Dispatch<React.SetStateAction<string>>;
  public fetchUsers: (search: string) => void;
  public setShowUsers: React.Dispatch<React.SetStateAction<boolean>>;
  public setTaggedUsernames: React.Dispatch<React.SetStateAction<string[]>>;

  constructor(
    cursorPosition: number | null,
    content: string,
    showUsers: boolean,
    taggedUsernames: string[],
    setCursorPosition: React.Dispatch<React.SetStateAction<number | null>>,
    setContent: React.Dispatch<React.SetStateAction<string>>,
    fetchUsers: (search: string) => void,
    setShowUsers: React.Dispatch<React.SetStateAction<boolean>>,
    setTaggedUsernames: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    this.cursorPosition = cursorPosition;
    this.content = content;
    this.showUsers = showUsers;
    this.taggedUsernames = taggedUsernames;
    this.setCursorPosition = setCursorPosition;
    this.setContent = setContent;
    this.fetchUsers = fetchUsers;
    this.setShowUsers = setShowUsers;
    this.setTaggedUsernames = setTaggedUsernames;
  }

  handleContentChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value, selectionStart } = e.target;

    const cursorPos = selectionStart;
    this.setCursorPosition(cursorPos);

    this.setContent(value);

    const lastWord = value.substring(0, cursorPos).split(' ').pop();

    // Detect backspace key press
    if ((e.nativeEvent as InputEvent).inputType === 'deleteContentBackward') {
      // Check if the last word starts with "@" (indicating a tagged user)
      if (lastWord && lastWord.startsWith('@')) {
        const usernameToRemove = lastWord.substring(1); // Remove "@" symbol
        this.handleRemoveTag(usernameToRemove);
      }
    } else {
      if (lastWord && lastWord.startsWith('@')) {
        // Remove "@" symbol
        const usernameToSearch = lastWord.substring(1);

        this.fetchUsers(usernameToSearch);
        this.setShowUsers(true);
      } else if (this.showUsers) {
        this.setShowUsers(false);
      }
    }
  };

  handleRemoveTag = (username: string) => {
    this.setTaggedUsernames(prevUsernames => prevUsernames.filter(u => u !== username));

    if (this.cursorPosition !== null) {
      // Find the last occurrence of `@username` before the current cursor position
      const lastAtIndex = this.content.lastIndexOf(`@${username}`, this.cursorPosition - 1);

      if (lastAtIndex !== -1) {
        // Replace the tagged username with an empty string in the content
        this.setContent(prevContent => {
          const contentBefore = prevContent.substring(0, lastAtIndex);
          const contentAfter = prevContent.substring(lastAtIndex + `@${username}`.length);
          return `${contentBefore}${contentAfter}`;
        });
      }
    }

    this.setShowUsers(false);
  };

  handleTagUser = (username: string) => {
    if (!this.taggedUsernames.includes(username))
      this.setTaggedUsernames(prevUsernames => [...prevUsernames, username]);

    if (this.cursorPosition !== null) {
      // Find the last "@" symbol before the current cursor position
      const lastAtIndex = this.content.lastIndexOf('@', this.cursorPosition - 1);

      if (lastAtIndex !== -1) {
        // Replace the part of the content with the selected username
        this.setContent(prevContent => {
          const contentBefore = prevContent.substring(0, lastAtIndex);
          const contentAfter = prevContent.substring(Number(this.cursorPosition));
          return `${contentBefore}@${username} ${contentAfter}`;
        });
      }
    }

    this.setShowUsers(false);
  };
}

export default TagUserUtils;
