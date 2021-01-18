# The Social Network
Monorepo of Front-End and Back-End for a social network application allowing people of similar interests/hobbies to meet each, connect through other social media accounts and chat
Back-End: NestJS Microservices, JWT, MongoDB, ImageKit and Docker
Front-End: Angular, Tailwind CSS

## Front-End
Tech stack:
    - Web framework: Angular
    - CSS framework (styling): Tailwind CSS
    - CSS component: Angular Material
    - Library: RxJs

## Tools
- VS Code extension: Tailwind CSS IntelliSense
- Color pallete: https://dribbble.com/shots/14591903-Stratified/attachments/6283154?mode=media
- Illustrations: https://undraw.co/

## Inspiration
- https://webframe.xyz/

Structure:
```
    projects
        site
            e2e
            src
            app
                core
                    interceptor
                        auth.interceptor.ts
                    component
                        navbar
                        header
                    services
                        auth.service.ts
                        data.service.ts
                        logger.service.ts (development of console.log and production of sentry.io)
                        utilities.service.ts
                        validation.service.ts
                    strategies
                        preload-modules.strategy.ts
                    guard
                        auth.guard.ts
                        no-auth.guard.ts
                        ensure-module-loaded-once.guard.ts
                    core.module.ts
                shared
                    pipes
                        capitalize.pipe.ts (first name and last name as first character uppercase and the others lowercase)
                        trim.pipe.ts
                    component
                        spinner
                    interfaces.ts (user, report, image interfaces)
                    material.module.ts
                    shared.module.ts
                layout
                    login
                    sign up
                    landing page
                        hero with what's this, how it benefit the user and search bar of interest and username (component)
                        common interests of most utilized interests/hobbies (component)
                        features meaning who we (meaning this app) are (component)
                        contact (component)
                    search result page
                        filter users (component)
                        users (component)
                    profile page
                    edit profile page
                    report user page
        admin
            e2e
            src
            app
                core
                    utilities
                    services
                shared
                    navbar
                    header
                features
                    login
                    dashboard page
                        current users (component)
                        reported users (component)
                        contact messages (component)
                    users list
                        search bar of users by username (component)
                        users (component)
```