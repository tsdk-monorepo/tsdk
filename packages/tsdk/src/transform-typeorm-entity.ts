export function transformTypeormEntity(_fileContent: string, entityLibName: string) {
  let fileContent = _fileContent;

  // remove import entityLibName(like `typeorm`) and remove entityLibName(like `typeorm`) decorators @xxx() / @xxx({.*}) / @xxx({ \n\n })
  const result = fileContent.split('\n');
  const imports: string[] = [];
  const otherContent: string[] = [];
  let importArr: string[] = [];

  let decoratorArr: string[] = [];

  result.forEach((i) => {
    const hasImport = i.indexOf('import ') > -1;
    const fromIdx = i.indexOf(' from');

    const commentIdx = i.indexOf('//');
    const commentIdx2 = i.indexOf('/*');
    const commentIdx3 = i.indexOf('*/');

    const isComment =
      (commentIdx > -1 && commentIdx < fromIdx) ||
      (commentIdx2 > -1 && commentIdx2 < fromIdx) ||
      (commentIdx3 > -1 && commentIdx3 > fromIdx);

    const hasFrom = fromIdx > -1 && !isComment && (i[fromIdx + 5] || '').trim() === '';
    const hasTypeormFrom =
      hasFrom && (i.indexOf(` '${entityLibName}`) > -1 || i.indexOf(` "${entityLibName}`) > -1);

    const decoratorMatch = i.match(/@.*\(.*/);
    const matched = decoratorMatch && decoratorMatch[0];
    const hasDecorator = !!matched;

    // for `@ManyToOne(() => Book, { nullable: true })`
    // replace ) =>
    const _i = i.replace(') =>', '');

    const hasDecoratorStart = hasDecorator && (_i.indexOf('({') > -1 || _i.indexOf('(') > -1);
    const hasDecoratorEnd = hasDecorator && (_i.indexOf('})') > -1 || _i.indexOf(')') > -1);

    const hasDecoratorEnd2 =
      decoratorArr.length > 0 && (_i.indexOf('})') > -1 || _i.indexOf(')') > -1);

    if (hasImport && hasTypeormFrom) {
      // ignore entityLibName(like `typeorm`)
    } else if (hasImport && hasFrom) {
      imports.push(i);
    } else if (hasImport) {
      importArr.push(i);
    } else if (hasTypeormFrom) {
      // ignore entityLibName(like `typeorm`)
      importArr = [];
    } else if (hasFrom) {
      importArr.push(i);
      imports.push(importArr.join('\n'));
      importArr = [];
    } else if (importArr.length > 0) {
      importArr.push(i);
    } else if (hasDecoratorStart && hasDecoratorEnd) {
      // ignore
    } else if (hasDecoratorStart) {
      decoratorArr.push(i);
    } else if (decoratorArr.length > 0 && !hasDecoratorEnd2) {
      decoratorArr.push(i);
    } else if (hasDecoratorEnd2) {
      decoratorArr = [];
    } else {
      otherContent.push(i);
    }
  });
  fileContent = `${imports.join('\n')}\n${otherContent.join('\n')}`;
  // remove entityLibName(like `typeorm`) end

  return fileContent;
}
