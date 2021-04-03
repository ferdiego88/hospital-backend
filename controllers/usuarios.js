const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res) => {

    const desde = Number(req.query.desde) || 0;
    console.log(desde);
    // const usuarios = await Usuario.find({}, 'nombre email role google')
    //     .skip(desde)
    //     .limit(5);
    // const total = await Usuario.count();

    const [usuarios, total] = await Promise.all([
        Usuario.find({}, 'nombre email role google img')
        .skip(desde)
        .limit(5),
        Usuario.countDocuments()
    ]);


    res.json({
        ok: true,
        usuarios,
        total
    })
}

const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;
    try {

        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está Registrado'
            })
        }


        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // Generar el TOKEN JWT
        const token = await generarJWT(usuario.id);

        // Guardar usuario
        await usuario.save(token);


        // console.log(req.body);
        res.json({
            ok: true,
            usuario,
            token,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: 'false',
            msg: 'Error inesperado... revisar logs'
        })
    }


}


const actualizarUsuario = async(req, res = response) => {

    // TO DO : Validar token y comprobar si es el usuario correcto
    const uid = req.params.id;
    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese Id'
            });
        }

        // Actualizaciones
        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {
            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        campos.email = email;
        // delete campos.password;
        // delete campos.google;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });


        // res.json({
        //     ok: true,
        //     uid
        // })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado al actualizar'
        })
    }

}

const eliminarUsuario = async(req, res = response) => {
    const uid = req.params.id;
    try {


        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese Id'
            });
        }

        await Usuario.findByIdAndDelete(uid);
        res.json({
            ok: true,
            msg: 'Usuario Eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado al Eliminar'
        })
    }
}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
}