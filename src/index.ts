const UL_LIST_DOT = '•';

enum ContentType {
  Ul = 'ul',
  Ol = 'ol',
}

interface LineInfo {
  start: number;
  end: number;
  text: string;
  type?: ContentType;
  number?: number;
}

interface Options {
  input: HTMLTextAreaElement;
  content?: string;
  point?: string;
}

export default class PlainTextEditor {
  content = '';
  input: HTMLTextAreaElement;
  point = '•';
  cursorPosition = 0;

  constructor(options: Options) {
    this.input = options.input;
    this.inputVal = options.content || '';
    this.point = options.point || UL_LIST_DOT;
    this._updateContent = this._updateContent.bind(this);
    this._handleEnter = this._handleEnter.bind(this);
    this._updateIndex = this._updateIndex.bind(this);
    this.input.addEventListener('input', this._updateContent);
    this.input.addEventListener('keydown', this._handleEnter);
    this.input.addEventListener('keyup', this._updateIndex);
    this.input.addEventListener('mouseup', this._updateIndex);
  }

  /**
   * 插入
   */
  insertUl() {
    this._insert(`${this.point} `);
    this.input.focus();
  }

  /**
   * 插入有序列表
   */
  insertOl(number = 1) {
    this._insert(`${number}. `);
    this.input.focus();
  }

  public destory() {
    this.input.removeEventListener('input', this._updateContent);
    this.input.removeEventListener('keydown', this._handleEnter);
    this.input.removeEventListener('keyup', this._updateIndex);
    this.input.removeEventListener('mouseup', this._updateIndex);
  }

  get inputVal() {
    return this.content;
  }

  set inputVal(value: string) {
    this.content = value;
    if (value !== this.input.value) {
      this.input.value = value;
    }
  }

  _updateContent() {
    this.inputVal = this.input.value;
  }

  _handleEnter(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const info = this._getCurLineInfo();
      if (info.type === ContentType.Ul) {
        this.insertUl();
      } else if (info.type === ContentType.Ol && info.number) {
        this.insertOl(info.number + 1);
      } else {
        this.inputVal += '\n';
      }
    }
  }

  /**
   * 获取当前光标所在行的信息
   */
  _getCurLineInfo(index = this.cursorPosition): LineInfo {
    const tmpText = this.inputVal.slice(0, index);
    const restText = this.inputVal.slice(index);
    const nextLineStart = restText.indexOf('\n');
    const wrapIndex = tmpText.lastIndexOf('\n');
    const curLineText = this.inputVal.slice(
      wrapIndex > -1 ? wrapIndex : 0,
      nextLineStart > -1 ? index + nextLineStart : undefined,
    );
    const olRex = wrapIndex > -1 ? /^\n\d\.\s/ : /^\d\.\s/;
    const ulRex = new RegExp(wrapIndex > -1 ? `^\\n${this.point}\\s` : `^${this.point}\\s`);
    const lineInfo: LineInfo = {
      start: wrapIndex > -1 ? wrapIndex : 0,
      end: nextLineStart > -1 ? index + nextLineStart : this.inputVal.length,
      text: curLineText,
    };
    if (ulRex.test(curLineText)) {
      lineInfo.type = ContentType.Ul;
    }
    if (olRex.test(curLineText)) {
      let number: number;
      const replaceReg = wrapIndex > -1 ? /^\n(\d)\.\s/ : /^(\d)\.\s/;
      curLineText.replace(replaceReg, (str1, str2) => {
        number = Number(str2);
        lineInfo.type = ContentType.Ol;
        lineInfo.number = isNaN(number) ? 0 : number;
        return '';
      });
    }
    return lineInfo;
  }

  /**
   * 插入内容
   */
  _insert(text: string) {
    const firstText = this.inputVal.slice(0, this.cursorPosition);
    const lastText = this.inputVal.slice(this.cursorPosition);
    let newText = '';
    if (firstText.endsWith('\n') || this.cursorPosition === 0) {
      newText = text + lastText;
    } else {
      newText = '\n' + text + lastText;
    }
    this.inputVal = firstText + newText;
    this._updateIndex();
  }

  /**
   * 更新光标位置
   */
  _updateIndex() {
    this.cursorPosition = this.input.selectionStart || this.inputVal.length;
    console.log('current line: ', this._getCurLineInfo());
  }
}
