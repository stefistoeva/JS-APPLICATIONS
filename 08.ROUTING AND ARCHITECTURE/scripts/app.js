import {get, post, put, del} from './requester.js';

(() => {
    const partials = {
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs'
    };

    const app = Sammy('#main', function() {
        this.use('Handlebars', 'hbs');

        this.get('#/', loadHome);
        this.get('#/home', loadHome);
        this.get('#/about', function(ctx) {
            getSessionInfo(ctx);
            
            this.loadPartials(partials)
            .then(function () {
                this.partial('./templates/about/about.hbs');
            })
        });
        
        this.get('#/login', function(ctx) {
            getSessionInfo(ctx);
            
            partials['loginForm'] = './templates/login/loginForm.hbs';
            this.loadPartials(partials)
            .then(function() {
                this.partial('./templates/login/loginPage.hbs');
            })
        });
        
        this.post('#/login', function (ctx) {
            const { username, password } = ctx.params;

            post('user', 'login', { username, password }, 'Basic')
                .then(userInfo => {
                    sessionStorage.setItem('userId', userInfo._id);
                    sessionStorage.setItem('authtoken', userInfo._kmd.authtoken);
                    sessionStorage.setItem('username', userInfo.username);

                    ctx.redirect('#/');
                })
                .catch(console.error);
        });

        this.get('#/register', function(ctx) {
            getSessionInfo(ctx);

            partials['registerForm'] = './templates/register/registerForm.hbs';
            this.loadPartials(partials)
                .then(function() {
                    this.partial('./templates/register/registerPage.hbs');
                })
        });

        this.post('#/register', function(ctx) {
            const { username, password, repeatPassword } = ctx.params;

            if(password === repeatPassword) {
                post('user', '', { username, password }, 'Basic')
                    .then(data => {
                        console.log(data);
                        ctx.redirect('#/login');
                    })
                    .catch(console.error);

            }
        });

        this.get('#/catalog', function(ctx) {
            partials['team'] = './templates/catalog/team.hbs';

            get('appdata', 'teams', 'Kinvey')
                .then((data) => {
                    ctx.teams = data;

                    this.loadPartials(partials)
                        .then(function() {
                            this.partial('./templates/catalog/teamCatalog.hbs');
                        });
                })
                .catch(console.error);
        });

        this.get('#/catalog/:id', function(ctx) {
            getSessionInfo(ctx);
            const id = ctx.params.id;
            partials['teamMember'] = './templates/catalog/teamMember.hbs';
            partials['teamControls'] = './templates/catalog/teamControls.hbs';

            get('appdata', `teams/${id}`, 'Kinvey')
                .then(teamInfo => {
                    // teamInfo.members.push({username: ctx.username});
                    ctx.members = teamInfo.members;
                    ctx.name = teamInfo.name;
                    ctx.description = teamInfo.description;

                    this.loadPartials(partials)
                        .then(function() {
                            this.partial('./templates/catalog/details.hbs');
                        });
                })
                .catch(console.error);
        });

        this.get('#/join/:id', function(ctx) {
            getSessionInfo(ctx);
            const id = ctx.params.id;

            get('appdata', `teams/${id}`, 'Kinvey')
                .then(teamInfo => {
                    teamInfo.members.push({username: ctx.username});

                    return put('appdata', `teams/${id}`, teamInfo, 'Kinvey');
                })
                .then(() => {
                    ctx.redirect(`#/catalog/${id}`);
                });
        })

        this.get('#/create', function(ctx) {
            getSessionInfo(ctx);

            partials['createForm'] = './templates/create/createForm.hbs';
            this.loadPartials(ctx, partials)
                .then(function() {
                    this.partial('./templates/create/createPage.hbs');
                });
        });

        this.post('#/create', function(ctx) {
            const { name, description } = ctx.params;
            const members = [
                { username: sessionStorage.username }
            ];
            post('appdata', 'teams', { name, description, members }, 'Kinvey')
                .then((data) => {
                    ctx.redirect('#/catalog');
                })
                .catch(console.error);
        })

        this.get('#/edit', function(ctx) {
            partials['editForm'] = './templates/edit/editForm.hbs';
            this.loadPartials(partials)
                .then(function() {
                    this.partial('./templates/edit/editForm.hbs');
                });
        })

        this.get('#/logout', function(ctx) {
            sessionStorage.clear();
            ctx.redirect('#/');
        });

        function loadHome(ctx) {
            getSessionInfo(ctx);

            this.loadPartials(partials)
                .then(function() {
                    this.partial('./templates/home/home.hbs');
                });
        }

        function getSessionInfo(ctx) {
            ctx.userId = sessionStorage.getItem('userId');
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
        }
    });

    app.run();
})()
