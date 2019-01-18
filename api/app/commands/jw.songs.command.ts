import { Argv, CommandModule } from 'yargs';
import { Songs } from '../core/sites/jw/songs';

export class JwSongsCommand implements CommandModule {
  public command = 'jw:songs';
  public describe = 'JW Songs';

  public async handler(argv: Argv) {
    const songs = new Songs();
    await songs.get();
    process.exit();
  }
}
