// ==UserScript==
// @name         KM文档选中文本字数统计（右下角版）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  光标选中文字后，自动在页面右下角展示字数统计
// @author       蔚蓝
// @match        https://km.mihoyo.com/doc/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const counterUI = document.createElement('div');
    counterUI.id = 'tm-selection-counter-ui';

    Object.assign(counterUI.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '8px 16px',
        backgroundColor: 'rgba(30, 30, 30, 0.85)',
        color: '#E0E0E0',
        borderRadius: '8px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '14px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(4px)',
        zIndex: '2147483647',
        pointerEvents: 'none',
        opacity: '0',
        transform: 'translateY(10px)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
        display: 'none'
    });

    document.body.appendChild(counterUI);


    function calculateWords(text) {
        if (!text) return { words: 0, chars: 0 };

        // 匹配中文字符
        const cnMatches = text.match(/[\u4e00-\u9fa5]/g) || [];
        // 匹配英文单词及数字组合 (按词计算)
        const enMatches = text.match(/[a-zA-Z0-9_]+/g) || [];

        // 中文按字算 + 英文按词算
        const logicWordCount = cnMatches.length + enMatches.length;

        return {
            words: logicWordCount,
            chars: text.length
        };
    }
    let timeoutId = null;

    document.addEventListener('selectionchange', () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            const selection = window.getSelection();
            const text = selection.toString().trim();

            if (text.length > 0) {
                const stats = calculateWords(text);

                counterUI.innerHTML = `字数：<strong style="color:#FFF; font-size:16px;">${stats.words}</strong> &nbsp;<span style="color:#A0A0A0; font-size:12px;">(字符: ${stats.chars})</span>`;

                counterUI.style.display = 'block';
                counterUI.offsetHeight;
                counterUI.style.opacity = '1';
                counterUI.style.transform = 'translateY(0)';
            } else {
                counterUI.style.opacity = '0';
                counterUI.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    if (window.getSelection().toString().trim().length === 0) {
                        counterUI.style.display = 'none';
                    }
                }, 200);
            }
        }, 150);
    });

})();
