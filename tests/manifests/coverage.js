// Inventories are pinned to the Kirby 5 docs/KB research from 2026-06-19:
// https://getkirby.com/docs/reference/panel/fields
// https://getkirby.com/docs/reference/panel/sections
// https://getkirby.com/docs/reference/panel/blueprints
const CORE_SECTIONS = [
    'fields',
    'files',
    'info',
    'pages',
    'stats',
]

const ROOT_FIELD_REFS = [
    'blocks',
    'checkboxes',
    'color',
    'date',
    'email',
    'entries',
    'files',
    'gap',
    'group',
    'headline',
    'hidden',
    'info',
    'layout',
    'line',
    'link',
    'list',
    'multiselect',
    'number',
    'object',
    'pages',
    'radio',
    'range',
    'select',
    'slug',
    'structure',
    'stats',
    'tags',
    'tel',
    'text',
    'textarea',
    'time',
    'toggle',
    'toggles',
    'url',
    'users',
    'writer',
]

const ROOT_SECTION_REFS = [
    'info',
    'fields',
    'files',
    'pages',
    'stats',
]

const ROOT_BLUEPRINT_REFS = [
    'block',
    'file',
    'page',
    'site',
    'tab',
    'user',
]

const BLUEPRINT_DEFS = [
    'block',
    'file',
    'page',
    'site',
    'user',
    'tab',
]

const BLUEPRINT_FIXTURES = [
    'block',
    'field',
    'file',
    'page',
    'section',
    'site',
    'tab',
    'user',
]

const WRAPPERS = [
    'columns',
    'fields',
    'sections',
    'tabs',
]

const WRAPPER_DEFS = [
    'fields',
    'sections',
    'columns',
    'tabs',
]

const INACTIVE_FIELD_DEFS = []

module.exports = {
    BLUEPRINT_DEFS,
    BLUEPRINT_FIXTURES,
    CORE_SECTIONS,
    INACTIVE_FIELD_DEFS,
    ROOT_FIELD_REFS,
    ROOT_BLUEPRINT_REFS,
    ROOT_SECTION_REFS,
    WRAPPER_DEFS,
    WRAPPERS,
}
