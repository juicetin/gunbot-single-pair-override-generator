# Gunbot 3.3.X (as of July 11th 2017) Single Pair Config Override Compatibility Generator

## What is this?
At the moment, Gunbot (see: https://gunthy.org/) has an `ALLPAIRS-params.js` config file that overrides all the individual pair configs (for example, `poloniex-BTC_ETH.js`). Some users prefer that their individual pair configs will override ALLPAIRS, so that settings from ALLPAIRS will *_only_* apply if a particular option in the individual pair config is left out.

## How do I use this?
To use this, you need two folders - one to hold all your configs that are written such that you expect any individual pair setting to override those in the ALLPAIRS config file, and another to hold the configs that are generated per pair based on this way of writing the configs. Note that the generated gunbot-compatible folder will _not_ have an `ALLPAIRS-config.js` - all the options have been included into each pair instead.

1. Clone the repository - `git clone https://github.com/juicetin/gunbot-single-pair-override-generator.git`
2. Change any settings you want in `config.js` - you can change the default folder names for your configs, as well as which exchange your configs are for (e.g. *poloniex* or *bittrex*)
3. Create a folder called `individual_predecence_style` to hold all your configs where individual settings should override ALLPAIR settings
4. Create a folder called `allpair_prededence_style` where the gunbot-compatible generated configs will be created
5. Run the command `npm start` - all your configs will then be generated in the `allpair_prededence_style` folder, which you can copy to your gunbot directory.

## Miscellaneous
This is just something I threw together for my own use, as an ALLPAIR-centric configuration setup was not ideal for anyone who wanted to tune configs per pair. Although it's just a very simple utility, feel free to make pull requests to fix any bugs, add new features/etc.

If this helped you in any way and you're feeling generous, feel free to send a small donation to any of the following addresses:
* BTC: 1FSdUzj7FsMpvjXbynsxwUytPzD9d2HQuP
* ETH: 0xF455Be4Cc8640FE17d38162A38a481B6881D93C2
