/*
Language: Onyx
Category: common, application
Website: https://onyxlang.io
*/

function onyx(hljs) {
    
    return {
        name: "Onyx",
        aliases: [ "onyx "],
        keywords: {
            keyword: [
                "package", "struct", "enum", "use", "global", "macro",
                "if", "elseif", "else", "where", "interface",
                "for", "while", "do",
                "switch", "case",
                "break", "continue", "return", "defer", "fallthrough",
                "cast", "sizeof", "alignof", "typeof"
            ].join(" "),
            literal: "true false null null_proc null_str",
            type: "i8 u8 i16 u16 i32 u32 i64 u64 f32 f64 rawptr str cstr i8x16 i16x8 i32x4 i64x2 f32x4 f64x2 v128 type_expr any",
            built_in: "math map set array random iter list conv type_info",
        },

        contains: [].concat(
            [
                hljs.COMMENT('//', '$', {}),
                hljs.C_BLOCK_COMMENT_MODE
            ],

            [
                hljs.C_NUMBER_MODE,
                hljs.QUOTE_STRING_MODE,
            ],

            [
                {
                    className: "keyword",
                    scope: "keyword",
                    begin: /#\w+/, 
                    end: ' ',
                }
            ]
        )
    };

}

window.addEventListener("load", () => {
    hljs.registerLanguage("onyx", onyx);

    Array.from(document.querySelectorAll("code"))
         .forEach(block => hljs.highlightBlock(block));
});
