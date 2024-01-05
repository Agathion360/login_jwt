

import passport from 'passport'
import LocalStrategy from 'passport-local'
import GithubStrategy from 'passport-github2'
import userModel from '../models/user.models.js'
import { createHash, isValidPassword } from '../utils.js'

const initPassport = () => {
    // Función utilizada por la estrategia registerAuth
    const verifyRegistration = async (req, username, password, done) => {
        try {
            const { first_name, last_name, email, gender } = req.body

            if (!first_name || !last_name || !email || !gender) {
                return done('Se requiere first_name, last_name, email y gender en el body', false)
            }

            const user = await userModel.findOne({ email: username })

            if (user) return done(null, false)
            
            const newUser = {
                first_name,
                last_name,
                email,
                gender,
                password: createHash(password)
            }

            const process = await userModel.create(newUser)

            return done(null, process)
        } catch (err) {
            return done(`Error passport local: ${err.message}`)
        }
    }

    // Función utilizada por la estrategia restoreAuth
    const verifyRestoration = async (req, username, password, done) => {
        try {
            if (username.length === 0 || password.length === 0) {
                return done('Se requiere email y pass en el body', false)
            }

            const user = await userModel.findOne({ email: username })

            // El usuario no existe, no podemos restaurar nada.
            // Llamamos a done() para terminar el proceso de
            // passport, con null (no hay error) y false (sin devolver datos de usuario)
            if (!user) return done(null, false)

            const process = await userModel.findOneAndUpdate({ email: username }, { password: createHash(password) })

            return done(null, process)
        } catch (err) {
            return done(`Error passport local: ${err.message}`)
        }
    }

    const verifyGithub = async (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        try {
            const user = await userModel.findOne({ email: profile._json.email })

            if (!user) {
                const name_parts = profile._json.name.split(' ')
                const newUser = {
                    first_name: name_parts[0],
                    last_name: name_parts[1],
                    email: profile._json.email,
                    gender: 'NA',
                    password: ' '
                }
    
                const process = await userModel.create(newUser)
    
                return done(null, process)
            } else {
                done(null, user)
            }
        } catch (err) {
            return done(`Error passport Github: ${err.message}`)
        }
    }
    
    // Creamos estrategia local de autenticación para registro
    passport.use('registerAuth', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email',
        passwordField: 'pass'
    }, verifyRegistration))

    // Creamos estrategia local de autenticación para restauración de clave
    passport.use('restoreAuth', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email',
        passwordField: 'pass'
    }, verifyRestoration))

    // Creamos estrategia para autenticación externa con Github
    passport.use('githubAuth', new GithubStrategy({
        clientID: 'Iv1.2bdf8d1969e29c8d',
        clientSecret: '928b7e215533c54d3243601cd843753dfbdd95bf',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, verifyGithub))
        
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
        
    passport.deserializeUser(async (id, done) => {
        try {
            done(null, await userModel.findById(id))
        } catch (err) {
            done(err.message)
        }
    })
}

export default initPassport