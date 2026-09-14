import type { LanguageRegistration } from 'shiki';

/**
 * A minimal TextMate grammar for AL (Microsoft Dynamics 365 Business Central).
 *
 * Shiki bundles 346 grammars but not AL, and the grammar shipped with the
 * official AL VS Code extension is not ours to redistribute — so this is
 * authored here instead. It is deliberately small: comments, strings, numbers,
 * object declarations, keywords, types and procedure names. That covers the
 * documentation use case without pretending to be a full parser.
 *
 * AL is Pascal-derived, so `begin`/`end` blocks, `:=` assignment and
 * single-quoted strings with `''` escapes all behave as they do there.
 */

const controlKeywords = [
  'begin',
  'end',
  'if',
  'then',
  'else',
  'case',
  'of',
  'repeat',
  'until',
  'while',
  'do',
  'for',
  'to',
  'downto',
  'foreach',
  'in',
  'exit',
  'break',
  'with',
];

const declarationKeywords = [
  'procedure',
  'local',
  'internal',
  'protected',
  'trigger',
  'var',
  'temporary',
  'event',
  'integration',
  'business',
  'returns',
];

const objectKeywords = [
  'codeunit',
  'table',
  'tableextension',
  'page',
  'pageextension',
  'pagecustomization',
  'report',
  'reportextension',
  'query',
  'xmlport',
  'enum',
  'enumextension',
  'interface',
  'permissionset',
  'permissionsetextension',
  'controladdin',
  'profile',
  'entitlement',
  'dotnet',
  'requestpage',
];

const structureKeywords = [
  'fields',
  'field',
  'keys',
  'key',
  'layout',
  'actions',
  'action',
  'area',
  'group',
  'repeater',
  'part',
  'dataitem',
  'column',
  'elements',
  'value',
  'values',
  'labels',
  'schema',
  'textelement',
  'fieldelement',
  'cuegroup',
  'usercontrol',
];

const types = [
  'Integer',
  'BigInteger',
  'Decimal',
  'Boolean',
  'Text',
  'Code',
  'Char',
  'Byte',
  'Date',
  'Time',
  'DateTime',
  'Duration',
  'DateFormula',
  'Guid',
  'Option',
  'Blob',
  'Media',
  'MediaSet',
  'RecordId',
  'TableFilter',
  'Variant',
  'Record',
  'RecordRef',
  'FieldRef',
  'KeyRef',
  'Page',
  'Report',
  'Codeunit',
  'Query',
  'XmlPort',
  'Dialog',
  'File',
  'InStream',
  'OutStream',
  'JsonObject',
  'JsonArray',
  'JsonToken',
  'JsonValue',
  'XmlDocument',
  'XmlElement',
  'HttpClient',
  'HttpRequestMessage',
  'HttpResponseMessage',
  'HttpContent',
  'HttpHeaders',
  'List',
  'Dictionary',
  'Label',
  'TextBuilder',
  'Enum',
  'Interface',
  'ErrorInfo',
  'Notification',
  'SessionSettings',
];

const constants = ['true', 'false', 'null'];

const alGrammar: LanguageRegistration = {
  name: 'al',
  scopeName: 'source.al',
  aliases: ['business-central'],
  patterns: [
    { include: '#comments' },
    { include: '#strings' },
    { include: '#object-declaration' },
    { include: '#procedure-declaration' },
    { include: '#property' },
    { include: '#keywords' },
    { include: '#types' },
    { include: '#constants' },
    { include: '#numbers' },
    { include: '#operators' },
  ],
  repository: {
    comments: {
      patterns: [
        {
          name: 'comment.line.double-slash.al',
          match: '//.*$',
        },
        {
          name: 'comment.block.al',
          begin: '/\\*',
          end: '\\*/',
        },
      ],
    },
    strings: {
      patterns: [
        {
          // AL escapes a quote by doubling it: 'it''s'
          name: 'string.quoted.single.al',
          begin: "'",
          end: "'(?!')",
          patterns: [{ name: 'constant.character.escape.al', match: "''" }],
        },
        {
          // Double quotes delimit identifiers containing spaces: "No. Series"
          name: 'variable.other.quoted.al',
          begin: '"',
          end: '"',
        },
      ],
    },
    'object-declaration': {
      // e.g. `codeunit 50100 "Payment Handler"` or `tableextension 50101 "Cust." extends Customer`
      match: `(?i)\\b(${objectKeywords.join('|')})\\b\\s+(\\d+)?\\s*("[^"]*"|[A-Za-z_][\\w]*)?(?:\\s+\\b(extends|implements)\\b\\s+("[^"]*"|[A-Za-z_][\\w]*))?`,
      captures: {
        '1': { name: 'storage.type.object.al' },
        '2': { name: 'constant.numeric.object-id.al' },
        '3': { name: 'entity.name.type.al' },
        '4': { name: 'keyword.other.al' },
        '5': { name: 'entity.other.inherited-class.al' },
      },
    },
    'procedure-declaration': {
      match: '(?i)\\b(procedure|trigger)\\b\\s+("[^"]*"|[A-Za-z_][\\w]*)',
      captures: {
        '1': { name: 'storage.type.function.al' },
        '2': { name: 'entity.name.function.al' },
      },
    },
    property: {
      // `Caption = 'Total';` — property names on the left of an assignment.
      match: '(?i)^\\s*([A-Za-z_][\\w]*)\\s*(=)',
      captures: {
        '1': { name: 'variable.other.property.al' },
        '2': { name: 'keyword.operator.assignment.al' },
      },
    },
    keywords: {
      patterns: [
        {
          name: 'keyword.control.al',
          match: `(?i)\\b(${controlKeywords.join('|')})\\b`,
        },
        {
          name: 'storage.modifier.al',
          match: `(?i)\\b(${declarationKeywords.join('|')})\\b`,
        },
        {
          name: 'keyword.other.structure.al',
          match: `(?i)\\b(${structureKeywords.join('|')})\\b`,
        },
        {
          name: 'keyword.operator.logical.al',
          match: '(?i)\\b(and|or|not|xor|div|mod)\\b',
        },
      ],
    },
    types: {
      name: 'support.type.al',
      match: `\\b(${types.join('|')})\\b`,
    },
    constants: {
      name: 'constant.language.al',
      match: `(?i)\\b(${constants.join('|')})\\b`,
    },
    numbers: {
      name: 'constant.numeric.al',
      match: '\\b\\d+(\\.\\d+)?\\b',
    },
    operators: {
      name: 'keyword.operator.al',
      match: ':=|<>|<=|>=|[+\\-*/<>=]|\\bin\\b',
    },
  },
};

export default alGrammar;
