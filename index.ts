const isBefore = (dateA: string, dateB: string) => {
  const [monthA, dayA] = breakDate(dateA);
  const [monthB, dayB] = breakDate(dateB);
  if (monthA < monthB) {
    return -1;
  } else if (monthA > monthB) {
    return 1;
  } else {
    return dayA - dayB;
  }
};
const breakDate = (date: string) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const day = +date.substring(0, 2);
  const month = months.indexOf(date.substring(2, 6));
  return [month, day];
};

const sortEntries = async (fileName: string) => {
  console.info(`sorting ${fileName}`);
  const text = await Deno.readTextFile(`./${fileName}`);
  const firstRow = text.indexOf('\t\t\\rownumber');
  const head = text.substring(0, firstRow);
  const tail = text.substring(text.indexOf('\t\\end{longtable}'), text.length);
  const matches = text
    .match(/\s\s\\rownumber\n(?:(?:\s\s&).*\n)*.*\n(.*)\\\\\n?/gi)
    ?.sort((a, b) => {
      const dateA = a.split('& ')[2].trim();
      const dateB = b.split('& ')[2].trim();
      if (dateA === '\\DATE') {
        return 1;
      }
      if (dateB === '\\DATE') {
        return -1;
      }
      return isBefore(dateA, dateB);
    });

  matches?.forEach(m => {
    if (m.indexOf('108-KSC-70P-497') > 0) console.log(m);
  });

  const [name, extension] = fileName.split('.');
  await Deno.writeTextFile(
    `./${name}-sorted.${extension}`,
    `${head}${matches?.join('\n') ?? ''}
${tail}`
  );
  console.info(`finished sorting ${fileName}`);
};
console.log('starting');
for await (const dirEntry of Deno.readDir('.')) {
  if (
    dirEntry.isFile &&
    dirEntry.name.endsWith('.tex') &&
    !dirEntry.name.endsWith('-sorted.tex')
  ) {
    await sortEntries(dirEntry.name);
  }
}
console.log('done');
