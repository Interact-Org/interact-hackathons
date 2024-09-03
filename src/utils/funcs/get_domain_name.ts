const getDomainName = (link: string): string => {
  try {
    const hostname = new URL(link).hostname;
    const regex = /(?:www\.)?(.*?)\.[^.]+$/;
    const match = hostname.match(regex);

    if (match) {
      return match[1];
    } else {
      return '';
    }
  } catch {
    return '';
  }
};

export default getDomainName;
