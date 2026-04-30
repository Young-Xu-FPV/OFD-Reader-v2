import type { OfdDocument, DocumentMetadata } from '../types';

const generateMockContent = (pageIndex: number): string => {
  const contents = [
    `<div class="ofd-page">
      <h1>电子保单</h1>
      <p>保单编号：BD2024000${pageIndex}</p>
      <p>投保人：张三</p>
      <p>被保险人：李四</p>
      <p>保险产品：人寿保险</p>
      <p>保险金额：100,000元</p>
      <p>保险期限：2024年1月1日 - 2034年1月1日</p>
    </div>`,
    `<div class="ofd-page">
      <h2>第一条 保险责任</h2>
      <p>在本合同有效期内，被保险人因意外伤害或疾病导致身故或残疾，本公司按约定给付保险金。</p>
      <p>意外伤害指遭受外来的、突发的、非本意的、非疾病的客观事件直接致使身体受到的伤害。</p>
    </div>`,
    `<div class="ofd-page">
      <h2>第二条 责任免除</h2>
      <p>因下列情形之一，导致被保险人身故或残疾的，本公司不承担给付保险金的责任：</p>
      <ul>
        <li>投保人对被保险人的故意杀害、故意伤害；</li>
        <li>被保险人故意犯罪或抗拒依法采取的刑事强制措施；</li>
        <li>被保险人自杀或故意自伤；</li>
        <li>被保险人酒后驾驶、无有效驾驶证驾驶或驾驶无有效行驶证的机动车；</li>
      </ul>
    </div>`,
    `<div class="ofd-page">
      <h2>第三条 保险期间</h2>
      <p>本合同的保险期间自本公司同意承保、收取首期保险费并签发保险单的次日零时起至本合同约定终止时止。</p>
      <p>具体保险期间以保险单上载明的为准。</p>
    </div>`,
    `<div class="ofd-page">
      <h2>第四条 保险金额与保险费</h2>
      <p>本合同的保险金额由投保人和本公司约定并在保险单上载明。</p>
      <p>保险费的交付方式分为趸交、年交、半年交或月交，由投保人在投保时选择。</p>
    </div>`,
    `<div class="ofd-page">
      <h2>第五条 如实告知</h2>
      <p>订立本合同时，本公司应向投保人说明本合同的内容。对保险条款中免除本公司责任的条款，本公司在订立合同时应当在投保单、保险单或者其他保险凭证上作出足以引起投保人注意的提示，并对该条款的内容以书面或者口头形式向投保人作出明确说明。</p>
    </div>`,
    `<div class="ofd-page">
      <h2>第六条 受益人</h2>
      <p>被保险人或投保人可以指定一人或数人为身故保险金受益人。</p>
      <p>受益人为数人的，被保险人或投保人可以确定受益顺序和受益份额；未确定受益份额的，受益人按照相等份额享有受益权。</p>
    </div>`,
    `<div class="ofd-page">
      <h2>第七条 保险金申请与给付</h2>
      <p>受益人向本公司申请给付保险金时，应提交以下材料：</p>
      <ol>
        <li>保险金给付申请书；</li>
        <li>保险单原件；</li>
        <li>受益人身份证明；</li>
        <li>相关证明和资料。</li>
      </ol>
    </div>`
  ];
  return contents[pageIndex % contents.length];
};

export const parseOfdFile = async (file: File): Promise<OfdDocument> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const metadata: DocumentMetadata = {
        title: file.name.replace(/\.[^/.]+$/, ''),
        author: '保险公司',
        subject: '电子保单',
        keywords: ['保险', '保单', 'OFD'],
        creationDate: new Date().toISOString(),
        modificationDate: new Date().toISOString()
      };

      const pageCount = 8;
      const pages = Array.from({ length: pageCount }, (_, i) => ({
        index: i,
        width: 600,
        height: 800,
        content: generateMockContent(i)
      }));

      const document: OfdDocument = {
        id: `doc-${Date.now()}`,
        name: file.name,
        pageCount,
        pages,
        metadata
      };

      resolve(document);
    }, 500);
  });
};

export const loadOfdFromUrl = async (url: string): Promise<OfdDocument> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to load OFD document');
  }
  
  const blob = await response.blob();
  const file = new File([blob], url.split('/').pop() || 'document.ofd', { type: 'application/ofd' });
  
  return parseOfdFile(file);
};

export const generateMockDocument = (): OfdDocument => {
  const metadata: DocumentMetadata = {
    title: '保险电子保单',
    author: '示例保险公司',
    subject: '人寿保险合同',
    keywords: ['保险', '保单', 'OFD', '电子保单'],
    creationDate: new Date().toISOString(),
    modificationDate: new Date().toISOString()
  };

  const pageCount = 8;
  const pages = Array.from({ length: pageCount }, (_, i) => ({
    index: i,
    width: 600,
    height: 800,
    content: generateMockContent(i)
  }));

  return {
    id: `doc-${Date.now()}`,
    name: '保险电子保单.ofd',
    pageCount,
    pages,
    metadata
  };
};
