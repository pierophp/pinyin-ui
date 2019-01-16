import * as replaceall from 'replaceall';
import * as replaceIdeogramsToSpace from '../../../../../../shared/helpers/special-ideograms-chars';
import { http } from '../../../../helpers/http';
import { Encoder } from '../../encoder';

export class AudioParser {
  public async parse($: CheerioStatic): Promise<string | undefined> {
    let media = $('.jsAudioPlayer a');
    if (media.length > 0) {
      return media.attr('href');
    }

    media = $('.jsAudioFormat a');
    if (media.length === 0) {
      return;
    }

    const encoder = new Encoder();

    try {
      let titleWithoutSpaces = replaceall(
        ' ',
        '',
        $('article header h1').text(),
      );
      replaceIdeogramsToSpace.forEach(item => {
        titleWithoutSpaces = replaceall(item, '', titleWithoutSpaces);
      });

      if (!titleWithoutSpaces) {
        return;
      }

      const responseAudio = await http.get(
        encoder.encodeUrl(media.attr('data-jsonurl')),
      );

      let fileUrl;

      responseAudio.data.files.CHS.MP3.some(file => {
        let audioTitleWithoutSpaces = replaceall(' ', '', file.title);
        replaceIdeogramsToSpace.forEach(item => {
          audioTitleWithoutSpaces = replaceall(
            item,
            '',
            audioTitleWithoutSpaces,
          );
        });

        if (audioTitleWithoutSpaces.contains(titleWithoutSpaces)) {
          fileUrl = file.file.url;
          return true;
        }

        return false;
      });

      return fileUrl;
    } catch (e) {
      // eslint-disable-next-line
      console.log(e);
    }

    return;
  }
}
