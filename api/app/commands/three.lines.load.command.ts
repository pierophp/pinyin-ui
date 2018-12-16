import { Argv, CommandModule } from 'yargs';
import { ThreeLinesParser } from '../core/parser/three.lines.parser';

export class ThreeLinesLoadCommand implements CommandModule {
  public command = '3lines:load';
  public describe = '3Lines Dict Load';

  public async handler(argv: Argv) {
    const threeLinesParser = new ThreeLinesParser();
    await threeLinesParser.parse();
    process.exit();
  }
}
