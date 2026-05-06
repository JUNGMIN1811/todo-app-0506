# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A vanilla JavaScript todo app with no build step, no dependencies, and no framework. Open `index.html` directly in a browser to run it.

## Architecture

Three files, each with a single responsibility:

- **`index.html`** — static markup only; no inline scripts or styles. The `<ul id="todoList">` is the sole dynamic mount point.
- **`style.css`** — all visual styling; component classes map 1-to-1 with HTML structure.
- **`app.js`** — all logic. State lives in the `todos` array (`{ text: string, done: boolean }[]`). Every mutation calls `render()`, which does a full DOM rebuild and syncs to `localStorage`.

## State & Persistence

`todos` is the single source of truth. It is loaded from `localStorage` on page load and written back on every `render()` call. There is no server, no async, and no additional state.

## 주석 규칙

모든 답변과 코드주석은 **한국어**로 작성한다.

index.html 파일은 절대 수정하지 않는다.