# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Latin Gwa Calculator

## [0.4.0] - 2026-01-17

### Added

- Added another level of hierarchy for academic years by adding Sessions
- Added Session type in type.ts

### Changed

- Moved fill property from path tag to svg tag to handle color changes


## [0.3.0] - 2026-01-17

### Added

- Unified controls for adding, resetting, selecting, importing, and exporting academic years
- Automatic saving of calculator progress with a specific "Save" action
- Separate views for "Workspace" and "Saved" with ability to restore backups
- Visual card displaying backup details (Date, GWA, Units) in the Saved view
- JSON file support for backing up individual Semesters, Academic Years, or the entire Education Overview
- Responsive layout adjustments for Subject Items and Action Bars (icon-only mode on small screens)

### Changed

- Removed the floating "Add an Academic Year" button at the bottom of the list
- Improved empty states for Semesters and the main Calculator area
- Enhanced UX with click-outside behavior for dropdown menus

## [0.2.4] - 2026-01-16

### Added

- Announcement component

## [0.2.3] - 2026-01-15

### Changed

- Swapped routing links between pages at navbar and footer

## [0.2.2] - 2026-01-15

### Added

- Version of web app beside the logos at navbar and footer

### Changed

- Rerouted path of logo at README.md to logo at public

### Removed

- Docs folder containing the logo of the web app for README.md

## [0.2.1] - 2026-01-14

### Added

- Animated calculation pattern background in navbar with floating math symbols
- Horizontal floating animation for navbar decorative elements
- Hover states for navbar and footer elements

## [0.2.0] - 2026-01-14

### Added

- Navbar component with navigation links and theme toggle slider UI
- Footer component with logo, navigation links, GitHub link, Buy Me a Coffee button, and disclaimer
- Responsive layout structure for navbar and footer
- Theme toggle slider UI (functionality to be implemented)
- Top shadow effect on footer

### Changed

- Updated page routing structure with About, Roadmap, and Disclaimer pages
- Enhanced README with Getting Started guide and installation instructions
- Fixed font configuration in globals.css (changed from serif to sans for Inter font)

## [0.1.2] - 2026-01-14

### Changed

- Enabled Turbopack experimental features for faster dev and build performance

## [0.1.1] - 2026-01-14

### Added

- Logo for the website
- Favicon
- `docs/screenshots` folder for README images

### Changed

- Updated README with improvements

## [0.1.0] - 2026-01-13

### Added

- Initial Next.js project setup with TypeScript and Tailwind CSS
- Basic project structure and configuration files

[unreleased]: https://github.com/johannbuere/bu-gwa-calc/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/johannbuere/bu-gwa-calc/compare/v0.3.0...v0.4.0 
[0.3.0]: https://github.com/johannbuere/bu-gwa-calc/compare/v0.2.4...v0.3.0
[0.2.4]: https://github.com/johannbuere/bu-gwa-calc/compare/v0.2.3...v0.2.4
[0.2.3]: https://github.com/johannbuere/bu-gwa-calc/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/johannbuere/bu-gwa-calc/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/johannbuere/bu-gwa-calc/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/johannbuere/bu-gwa-calc/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/johannbuere/bu-gwa-calc/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/johannbuere/bu-gwa-calc/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/johannbuere/bu-gwa-calc/releases/tag/v0.1.0
