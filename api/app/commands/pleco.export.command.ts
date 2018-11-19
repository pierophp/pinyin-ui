import { Argv, CommandModule } from 'yargs';

import { PlecoExport } from '../core/exports/pleco.export';

export class PlecoExportCommand implements CommandModule {
  public command = 'pleco:export';
  public describe = 'Pleco Export';

  public async handler(argv: Argv) {
    console.info('Start export to Pleco');
    const plecoExport = new PlecoExport();
    await plecoExport.exportPt();
    await plecoExport.exportChineseToolsPt();
    await plecoExport.exportChineseToolsEs();
    await plecoExport.exportChineseToolsEn();
    process.exit();
  }
}
