class MathUtil {

    constructor(seed=1) {
        this.seed = seed;
    }
    
    /**
     *  Implementation of Park-Miller-Carta PRNG ported from:
     *  http://lab.polygonal.de/2007/04/21/a-good-pseudo-random-number-generator-prng/
     */
    random() {
        this.seed = (this.seed * 16807) % 2147483647;
        return this.seed / 2147483647;
    }

}