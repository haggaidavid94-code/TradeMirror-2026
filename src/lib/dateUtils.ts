export const parseTradeDate = (dateStr: string) => {
  if (!dateStr) return new Date();

  // Handle ISO format YYYY-MM-DD
  if (dateStr.includes('-')) {
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) return date;
    } catch (e) {
      // Fallback
    }
  }

  const months: Record<string, number> = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  
  const parts = dateStr.split(' ');
  if (parts.length < 2) return new Date();

  const month = months[parts[0]] ?? 0;
  const rawDay = parts[1] || '1';
  const day = parseInt(rawDay.replace(',', ''));
  
  // Try to find a year in the string
  const yearPart = parts.find(p => p.length === 4 && !isNaN(parseInt(p)));
  const year = yearPart ? parseInt(yearPart) : new Date().getFullYear();
  
  return new Date(year, month, day || 1);
};

export const isDateInRange = (date: Date, range: string) => {
  if (range === 'All Time' || !range) return true;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (range === 'Today') {
    return date.getTime() === today.getTime();
  }

  if (range === 'Yesterday') {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return date.getTime() === yesterday.getTime();
  }

  if (range === 'Last 7 Days') {
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return date >= sevenDaysAgo && date <= today;
  }

  if (range === 'Last 30 Days') {
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return date >= thirtyDaysAgo && date <= today;
  }

  if (range === 'This Month') {
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  }

  if (range === 'Last Month') {
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
  }

  if (range === 'Last Quarter') {
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return date >= threeMonthsAgo && date <= today;
  }

  if (range === 'Year to Date') {
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    return date >= startOfYear && date <= today;
  }

  // Handle specific range like "Oct 1 - Oct 31, 2023"
  if (range.includes(' - ')) {
    // Simple check for demo purposes
    return true; 
  }

  return true;
};
