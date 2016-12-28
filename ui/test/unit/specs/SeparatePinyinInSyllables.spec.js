import separatePinyinInSyllables from 'src/helpers/separate-pinyin-in-syllables';
describe('Separate pinyin in syllables', () => {
  it('Separate pinyin in syllables', () => {
    expect(separatePinyinInSyllables('jiānrěnbùbá'))
      .to.equal('jiān rěn bù bá');
  });
});
