<template>
  <div>
    <div
      v-if="
        type === 'pt' && ((dictionary.pt && dictionary.pt.length) || user.admin)
      "
    >
      <div class="dict-title">
        Português
        <GoogleTranslateLink
          :word="dictionary.pt ? dictionary.pt.join('\n') : ''"
          sourceLanguage="pt"
          :targetLanguage="translationLanguage"
        />
      </div>
      <div class="dict-block">
        <div v-if="!editing">
          <div v-for="(pt, dictId) in dictionary.pt" v-bind:key="dictId">
            {{ pt }}
            <GoogleTranslateLink
              :word="pt"
              sourceLanguage="pt"
              :targetLanguage="translationLanguage"
            />
          </div>

          <v-btn v-if="user.admin" color="primary" @click="edit()">{{
            $t("edit")
          }}</v-btn>
        </div>
        <div v-if="editing">
          <div class="field-container">
            <textarea
              v-model="dictionaryEntry"
              autocapitalize="none"
              :cols="isMobile() ? 30 : 50"
            ></textarea>
          </div>

          <v-btn v-if="user.admin" color="primary" @click="save()">{{
            $t("save")
          }}</v-btn>

          <v-btn v-if="user.admin" color="secondary" @click="cancelEdit()">{{
            $t("cancel")
          }}</v-btn>
        </div>
      </div>
    </div>

    <div
      v-if="
        type === 'chinese_tools_pt' &&
        dictionary.chinese_tools_pt &&
        dictionary.chinese_tools_pt.length
      "
    >
      <form
        action="https://www.chinese-tools.com/tools/chinese-portuguese-dictionary.html"
        method="POST"
        target="_blank"
        id="form-ct-pt"
      >
        <input type="hidden" name="dico" :value="dictionary.ideograms" />
      </form>
      <div class="dict-title">
        <a href="javascript:void(0)" @click="openChineseTools('pt')"
          >Chinese Tools - Português</a
        >
        <GoogleTranslateLink
          :word="dictionary.chinese_tools_pt.join('\n')"
          sourceLanguage="pt"
          :targetLanguage="translationLanguage"
        />
      </div>
      <div class="dict-block">
        <div
          v-for="(chinese_tools_pt, dictId) in dictionary.chinese_tools_pt"
          v-bind:key="dictId"
        >
          {{ chinese_tools_pt }}
          <GoogleTranslateLink
            :word="chinese_tools_pt"
            sourceLanguage="pt"
            :targetLanguage="translationLanguage"
          />
        </div>
      </div>
    </div>

    <div
      v-if="
        type === 'glosbe_pt' &&
        dictionary.glosbe_pt &&
        dictionary.glosbe_pt.length
      "
    >
      <div class="dict-title">
        <a
          :href="'https://glosbe.com/zh/pt/' + dictionary.ideograms"
          target="_blank"
          >GLOSBE - Português</a
        >
        <GoogleTranslateLink
          :word="dictionary.glosbe_pt.join('\n')"
          sourceLanguage="pt"
          :targetLanguage="translationLanguage"
        />
      </div>
      <div class="dict-block">
        <div
          v-for="(glosbe_pt, dictId) in dictionary.glosbe_pt"
          v-bind:key="dictId"
        >
          {{ glosbe_pt }}
          <GoogleTranslateLink
            :word="glosbe_pt"
            sourceLanguage="pt"
            :targetLanguage="translationLanguage"
          />
        </div>
      </div>
    </div>

    <div
      v-if="
        type === 'chinese_tools_es' &&
        dictionary.chinese_tools_es &&
        dictionary.chinese_tools_es.length
      "
    >
      <form
        action="https://www.chinese-tools.com/tools/chinese-spanish-dictionary.html"
        method="POST"
        target="_blank"
        id="form-ct-es"
      >
        <input type="hidden" name="dico" :value="dictionary.ideograms" />
      </form>
      <div class="dict-title">
        <a href="javascript:void(0)" @click="openChineseTools('es')"
          >Chinese Tools - Español</a
        >
        <GoogleTranslateLink
          :word="dictionary.chinese_tools_es.join('\n')"
          sourceLanguage="es"
          :targetLanguage="translationLanguage"
        />
      </div>
      <div class="dict-block">
        <div
          v-for="(chinese_tools_es, dictId) in dictionary.chinese_tools_es"
          v-bind:key="dictId"
        >
          {{ chinese_tools_es }}
          <GoogleTranslateLink
            :word="chinese_tools_es"
            sourceLanguage="es"
            :targetLanguage="translationLanguage"
          />
        </div>
      </div>
    </div>

    <div
      v-if="
        type === 'glosbe_es' &&
        dictionary.glosbe_es &&
        dictionary.glosbe_es.length
      "
    >
      <div class="dict-title">
        <a
          :href="'https://glosbe.com/zh/es/' + dictionary.ideograms"
          target="_blank"
          >GLOSBE - Español</a
        >
        <GoogleTranslateLink
          :word="dictionary.glosbe_es.join('\n')"
          sourceLanguage="es"
          :targetLanguage="translationLanguage"
        />
      </div>
      <div class="dict-block">
        <div
          v-for="(glosbe_es, dictId) in dictionary.glosbe_es"
          v-bind:key="dictId"
        >
          {{ glosbe_es }}
          <GoogleTranslateLink
            :word="glosbe_es"
            sourceLanguage="es"
            :targetLanguage="translationLanguage"
          />
        </div>
      </div>
    </div>

    <div v-if="type === 'unihan' && dictionary.unihan">
      <div class="dict-title">
        <a
          :href="
            'https://www.unicode.org/cgi-bin/GetUnihanData.pl?codepoint=' +
            dictionary.ideograms
          "
          target="_blank"
          >Unihan - English</a
        >
        <GoogleTranslateLink
          :word="dictionary.unihan.join('\n')"
          sourceLanguage="en"
          :targetLanguage="translationLanguage"
        />
      </div>
      <div class="dict-block">
        <div v-for="(unihan, dictId) in dictionary.unihan" v-bind:key="dictId">
          {{ unihan }}
          <GoogleTranslateLink
            :word="unihan"
            sourceLanguage="en"
            :targetLanguage="translationLanguage"
          />
        </div>
      </div>
    </div>

    <div v-if="type === 'cedict' && dictionary.cedict">
      <div class="dict-title">
        <a
          :href="
            'https://cc-cedict.org/editor/editor.php?handler=QueryDictionary&amp;querydictionary_search=' +
            dictionary.ideograms
          "
          target="_blank"
          >CC-CEDICT - English</a
        >
        <GoogleTranslateLink
          :word="dictionary.cedict.join('\n')"
          sourceLanguage="en"
          :targetLanguage="translationLanguage"
        />
      </div>
      <div class="dict-block">
        <div v-for="(cedict, dictId) in dictionary.cedict" v-bind:key="dictId">
          {{ cedict }}
          <GoogleTranslateLink
            :word="cedict"
            sourceLanguage="en"
            :targetLanguage="translationLanguage"
          />
        </div>
      </div>
    </div>

    <div
      v-if="
        type === 'chinese_tools_en' &&
        dictionary.chinese_tools_en &&
        dictionary.chinese_tools_en.length
      "
    >
      <form
        action="https://www.chinese-tools.com/tools/dictionary.html"
        method="POST"
        target="_blank"
        id="form-ct-en"
      >
        <input type="hidden" name="dico" :value="dictionary.ideograms" />
      </form>
      <div class="dict-title">
        <a href="javascript:void(0)" @click="openChineseTools('en')"
          >Chinese Tools - English</a
        >
        <GoogleTranslateLink
          :word="dictionary.chinese_tools_en.join('\n')"
          sourceLanguage="en"
          :targetLanguage="translationLanguage"
        />
      </div>
      <div class="dict-block">
        <div
          v-for="(chinese_tools_en, dictId) in dictionary.chinese_tools_en"
          v-bind:key="dictId"
        >
          {{ chinese_tools_en }}
          <GoogleTranslateLink
            :word="chinese_tools_en"
            sourceLanguage="en"
            :targetLanguage="translationLanguage"
          />
        </div>
      </div>
    </div>

    <div
      v-if="
        type === 'glosbe_en' &&
        dictionary.glosbe_en &&
        dictionary.glosbe_en.length
      "
    >
      <div class="dict-title">
        <a
          :href="'https://glosbe.com/zh/en/' + dictionary.ideograms"
          target="_blank"
          >GLOSBE - English</a
        >
        <GoogleTranslateLink
          :word="dictionary.glosbe_en.join('\n')"
          sourceLanguage="en"
          :targetLanguage="translationLanguage"
        />
      </div>
      <div class="dict-block">
        <div
          v-for="(glosbe_en, dictId) in dictionary.glosbe_en"
          v-bind:key="dictId"
        >
          {{ glosbe_en }}
          <GoogleTranslateLink
            :word="glosbe_en"
            sourceLanguage="en"
            :targetLanguage="translationLanguage"
          />
        </div>
      </div>
    </div>

    <div v-if="type === 'en' && dictionary.en && dictionary.en.length">
      <div class="dict-title">
        English
        <GoogleTranslateLink
          :word="dictionary.en.join('\n')"
          sourceLanguage="en"
          :targetLanguage="translationLanguage"
        />
      </div>
      <div class="dict-block">
        <div v-for="(en, dictId) in dictionary.en" v-bind:key="dictId">
          {{ en }}
          <GoogleTranslateLink
            :word="en"
            sourceLanguage="en"
            :targetLanguage="translationLanguage"
          />
        </div>
      </div>
    </div>

    <div v-if="type === 'es' && dictionary.es && dictionary.es.length">
      <div class="dict-title">
        Español
        <GoogleTranslateLink
          :word="dictionary.es.join('\n')"
          sourceLanguage="es"
          :targetLanguage="translationLanguage"
        />
      </div>
      <div class="dict-block">
        <div v-for="(es, dictId) in dictionary.es" v-bind:key="dictId">
          {{ es }}
          <GoogleTranslateLink
            :word="es"
            sourceLanguage="es"
            :targetLanguage="translationLanguage"
          />
        </div>
      </div>
    </div>

    <div v-if="type === 'moedict' && moedict">
      <LoadableContent :loading="moedictLoading" :portal="false">
        <div class="dict-title">
          <a
            :href="'https://www.moedict.tw/' + dictionary.ideograms"
            target="_blank"
            >Moedict - Chinese</a
          >
        </div>
        <div class="dict-block">
          <div
            v-for="(definition, definitionId) in moedict.definitions"
            v-bind:key="definitionId"
          >
            <div class="moedict-container">
              <span class="dict-definition-title"
                >{{ $t("definition") + " " + (definitionId + 1) }}:</span
              >
              <file-container
                ref="fileContainer"
                :lines="[definition.def]"
                :fullLines="[definition.def]"
                :parent="true"
                :showMenuNavigation="false"
                :showHighlight="false"
                :useFullLines="false"
              />

              <div v-if="definition.synonyms">
                <span class="dict-definition-title">{{ $t("synonyms") }}</span>
                <file-container
                  ref="fileContainer"
                  :lines="[definition.synonyms]"
                  :fullLines="[definition.synonyms]"
                  :parent="true"
                  :showMenuNavigation="false"
                  :showHighlight="false"
                  :useFullLines="false"
                />
              </div>

              <div v-if="definition.antonyms">
                <span class="dict-definition-title">{{ $t("antonyms") }}</span>
                <file-container
                  ref="fileContainer"
                  :lines="[definition.antonyms]"
                  :fullLines="[definition.antonyms]"
                  :parent="true"
                  :showMenuNavigation="false"
                  :showHighlight="false"
                  :useFullLines="false"
                />
              </div>
            </div>
          </div>
        </div>
      </LoadableContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
import OptionsManager from "@/domain/options-manager";
import { PropType, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import User from "@/domain/user";
import isMobile from "@/helpers/is-mobile";
import GoogleTranslateLink from "@/components/dictionary/GoogleTranslateLink.vue";
import LoadableContent from "@/components/common/loading/LoadableContent.vue";
import http from "@/helpers/http";
import separatePinyinInSyllables from "@/helpers/separate-pinyin-in-syllables";
import trim from "lodash/trim";

type Dictionary = {
  ideograms: string;
  pt: string[];
  en: string[];
  es: string[];
  chinese_tools_pt: string[];
  chinese_tools_es: string[];
  chinese_tools_en: string[];
  glosbe_pt: string[];
  glosbe_es: string[];
  glosbe_en: string[];
  unihan: string[];
  cedict: string[];
};

type Block = {
  pinyinSpaced?: number;
  c: string;
  p: string;
};

type MoeDictionary = {
  definitions: {
    def?: Block[];
    antonyms?: Block[];
    synonyms?: Block[];
  }[];
};

const { pinyin, dictionary, type } = defineProps({
  pinyin: Object,
  dictionary: {
    type: Object as PropType<Dictionary>,
    required: true,
  },
  type: String,
});

const emit = defineEmits(["change-show"]);

const editing = ref(false);
const moedictLoading = ref(false);

const dictionaryEntry = ref(getDictionaryEntry());
const i18n = useI18n();

const optionsManager = new OptionsManager(i18n);
const options = optionsManager.getOptions();
const translationLanguage = options.translationLanguage;
const user = User.getUser();

function getDictionaryEntry() {
  let dictionaryEntry = "";
  if (!dictionary.pt) {
    dictionary.pt = [];
  }

  dictionary.pt.forEach((entry) => {
    dictionaryEntry += `${entry}\n`;
  });

  dictionaryEntry = trim(dictionaryEntry, "\n");

  return dictionaryEntry;
}

function cancelEdit() {
  editing.value = false;
  emit("change-show", editing);
}

function edit() {
  editing.value = true;
  emit("change-show", editing);
}

function openChineseTools(language: string) {
  const form = document.getElementById(
    `form-ct-${language}`
  ) as HTMLFormElement;
  form.submit();
}

async function loadMoedict() {
  if (!dictionary.ideograms) {
    setTimeout(() => {
      loadMoedict();
    }, 500);

    return;
  }

  moedictLoading.value = true;

  const optionsManager = new OptionsManager(i18n);
  const options = optionsManager.getOptions();

  const moedictResponse = (
    await http.get("dictionary/moedict", {
      params: {
        ideogram: dictionary.ideograms,
        pronunciation: pinyin,
      },
    })
  ).data.definition;

  const definitions =
    options.ideogramType === "t"
      ? moedictResponse.traditionalDefinitions
      : moedictResponse.simplifiedDefinitions;

  const newDefinitions = [];

  function parsePinyin(
    pinyinObject: any,
    ideogramsObject: any,
    parseKey: string
  ): undefined | Block[] {
    if (!pinyinObject[parseKey]) {
      return;
    }

    let blockCount = 0;
    let characterCounter = 0;

    const line: Block[] = [];

    for (const pinyinDef of pinyinObject[parseKey]) {
      const pinyinList = separatePinyinInSyllables(
        (pinyinDef || "").replaceAll(" ", String.fromCharCode(160)),
        false
      )
        .join(String.fromCharCode(160))
        .split(String.fromCharCode(160));

      for (const pinyin of pinyinList) {
        if (!line[blockCount]) {
          line[blockCount] = { c: "", p: "" };

          if (blockCount === 0) {
            line[blockCount].pinyinSpaced = 1;
          }
        }

        line[blockCount].c += ideogramsObject[parseKey][characterCounter];
        line[blockCount].p += pinyin + String.fromCharCode(160);

        characterCounter++;
      }

      blockCount++;
    }

    return line;
  }

  let i = 0;
  for (const definition of definitions) {
    newDefinitions.push({
      def: parsePinyin(moedictResponse.pinyinDefinitions[i], definition, "def"),
      antonyms: parsePinyin(
        moedictResponse.pinyinDefinitions[i],
        definition,
        "antonyms"
      ),
      synonyms: parsePinyin(
        moedictResponse.pinyinDefinitions[i],
        definition,
        "synonyms"
      ),
    });
    i++;
  }

  moedict.value = {
    definitions: newDefinitions,
  };

  moedictLoading.value = false;
}

function save() {
  const dictionatyList = dictionaryEntry.value
    .split("\n")
    .filter((item) => item.trim());

  http
    .post("unihan/save", {
      pinyin: pinyin,
      ideograms: dictionary.ideograms,
      dictionary: dictionatyList,
    })
    .then(() => {
      dictionary.pt = dictionatyList;
      editing.value = false;
      emit("change-show", editing);
    });
}

watch([dictionary], () => {
  dictionaryEntry.value = getDictionaryEntry();
});

const moedict = ref<MoeDictionary | null>(null);
if (type === "moedict") {
  loadMoedict();
}
</script>

<style>
.dict-block {
  padding-bottom: 10px;
}

.dict-title {
  font-weight: bold;
  font-size: 16px;
}

.dict-title a {
  color: #000 !important;
}

.dict-block .md-input-container {
  margin-top: 0 !important;
}

.dict-block .dict-definition-title {
  font-weight: bold;
}

.dict-block textarea {
  height: 250px !important;
}

.moedict-container {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px 10px;
  margin-bottom: 5px;
}

.moedict-container .print {
  margin: 0 !important;
}

.moedict-container .print-scroll {
  padding: 0 !important;
}
</style>
