# Changelog

This project uses [semantic versioning](https://semver.org/).

## v3.1.0 (2024-07-16)

- Removed the `storage` permission
- Changed the option to always use sentence case (_Single tab only_)

[`v3.0.0...v3.1.0`](https://github.com/valtlai/gmail-button/compare/v3.0.0...v3.1.0)

## v3.0.0 (2022-04-01)

- BREAKING: Upgraded to manifest v3
- BREAKING: Required Chrome 100 or greater

[`v3.0.0`](https://github.com/valtlai/gmail-button/tree/v3.0.0)

## v2.0.0 (2019-06-23)

- Made the `tabs` permission (labeled as _browsing history_) optional
	- Replaced the _Allow multiple tabs_ option with _Single tab only_,
	  disabled by default
	- The permission will be requested after the option is checked
	  and removed after it’s unchecked
- Changed to use title case on Mac (_Single Tab Only_)

## v1.2.1 (2019-04-15)

- Avoided code duplication

## v1.2.0 (2019-04-12)

- Added an option allowing to open multiple Gmail tabs
- Increased the minimum Chrome version

## v1.1.2 (2019-04-09)

- Made the background script non-persistent
- Set the minimum Chrome version

## v1.1.1 (2019-04-07)

- Avoided an HTTP redirect

## v1.1.0 (2019-04-07)

- Tweaked the icon (now a 16&nbsp;px grid)
- Removed an unnecessary permission
- Added Content Security Policy
- Refactored code

## v1.0.0 (2016-12-13)

- Initial release
