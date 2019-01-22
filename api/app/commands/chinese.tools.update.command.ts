import { CommandModule } from 'yargs';
import { IdeogramsConverter } from '../core/converter/ideograms.converter';
import { ChineseToolsParser } from '../core/parser/chinese.tools.parser';
import { CjkRepository } from '../repository/cjk.repository';

const ideogramsConverter = new IdeogramsConverter();
export class ChineseToolsUpdateCommand implements CommandModule {
  public command = 'chinesetools:update';
  public describe = 'Update Chinese Tools';
  builder(yargs: any) {
    return yargs.option('l', {
      alias: 'language',
      describe: 'Language',
    });
  }

  public async handler(argv: any) {
    let languages = ['pt', 'en', 'es'];
    if (argv.language) {
      languages = [argv.language];
    }

    const chineseToolsParser = new ChineseToolsParser();

    try {
      for (const language of languages) {
        console.log('\n', new Date(), language);
        const cjks = await CjkRepository.findChineseToolsNotNull(language);
        for (const cjk of cjks) {
          const ideogram = ideogramsConverter.convertUtf16ToIdeograms(
            cjk.ideogram,
          );
          console.log(ideogram);

          try {
            const response = await chineseToolsParser.parse(
              ideogram,
              cjk.pronunciation,
              language,
            );

            const saveOptions: any = {
              id: cjk.id,
            };

            saveOptions[`definition_ct_${language}`] = JSON.stringify(response);

            await CjkRepository.save(saveOptions);
          } catch (e) {
            console.log(e.message);
            continue;
          }

          // AWAIT 10 seconds
          await new Promise(resolve => {
            setTimeout(resolve, 10000);
          });
        }
      }
      process.exit();
    } catch (e) {
      console.log(e);
      process.exit();
    }
  }
}
