import { CommandModule } from 'yargs';
import { IdeogramsConverter } from '../core/converter/ideograms.converter';
import { GlosbeParser } from '../core/parser/glosbe.parser';
import { CjkRepository } from '../repository/cjk.repository';

const ideogramsConverter = new IdeogramsConverter();
export class GlosbeInsertCommand implements CommandModule {
  public command = 'glosbe:insert';
  public describe = 'Insert Glosbe';
  builder(yargs: any) {
    return yargs.option('l', {
      alias: 'language',
      describe: 'Language',
    });
  }

  public async handler(argv: any) {
    let languages: any = { pt: 4, es: 9, en: 9 };
    if (argv.language) {
      languages = {};
      languages[argv.language] = 20;
    }

    const glosbeParser = new GlosbeParser();

    try {
      for (const language of Object.keys(languages)) {
        console.log(
          '\n',
          new Date(),
          language,
          ' total: ',
          languages[language],
        );

        const cjks = await CjkRepository.findGlosbeIsNull(
          language,
          languages[language],
        );

        for (const cjk of cjks) {
          const ideogram = ideogramsConverter.convertUtf16ToIdeograms(
            cjk.ideogram,
          );
          console.log(ideogram);

          try {
            const response = await glosbeParser.parse(ideogram, language);

            const saveOptions: any = {
              id: cjk.id,
            };

            saveOptions[`definition_glosbe_${language}`] = JSON.stringify(
              response,
            );

            await CjkRepository.save(saveOptions);
          } catch (e) {
            console.log(e.message);
            continue;
          }

          // AWAIT 15 seconds
          await new Promise(resolve => {
            setTimeout(resolve, 15000);
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
