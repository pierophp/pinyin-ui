import * as types from "./types";

export default {
  [types.BIBLE_GETTER_BOOKS_EXHIBITION_TYPE]({ booksExhibitionType }: any) {
    return booksExhibitionType;
  },

  [types.BIBLE_GETTER_BOOKS_SHOW_PINIYN]({ booksShowPinyin }: any) {
    return booksShowPinyin;
  },

  [types.BIBLE_GETTER_VERSES_SHOW_AS_MODAL]({ versesShowAsModal }: any) {
    return versesShowAsModal;
  },

  [types.BIBLE_GETTER_VERSES_MODAL_VISIBLE]({ versesModalVisible }: any) {
    return versesModalVisible;
  },

  [types.BIBLE_GETTER_OPEN_CHAPTER_ON_LOAD]({ openChapterOnLoad }: any) {
    return openChapterOnLoad;
  },
};
