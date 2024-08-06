
export const isAuthenticated = (req, res, next) => {
    if (req.user) {
        return next();
    }
    res.redirect('/login');
};

export const isNotAuthenticated = (req, res, next) => {
    if (!req.user) {
        return next();
    } 
    res.redirect('/profile');
};

export const isPremium = (req, res, next) => {
    if (req.user && req.user.role === 'premium') {
        return next()
    } else {
        res.status(403).send('Acceso denegado: solo los usuario premium pueden acceder a esta pagina')
    }
}

export const isUser = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado: Solo los usuarios pueden realizar esta acción.' });
    }
}