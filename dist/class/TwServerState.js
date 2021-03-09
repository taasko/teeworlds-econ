"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwServerState = void 0;
class TwServerState {
    constructor() {
        // FIXME: types, remove `any`
        this.settings = {
            sv_warmup: null,
            sv_scorelimit: null,
            sv_timelimit: null,
            sv_gametype: null,
            sv_map: null,
            sv_maprotation: null,
            sv_matches_per_map: null,
            sv_motd: null,
            sv_player_slots: null,
            sv_max_clients: null,
            sv_teambalance_time: null,
            sv_spamprotection: null,
            sv_tournament_mode: null,
            sv_player_ready_mode: null,
            sv_strict_spectate_mode: null,
            sv_silent_spectator_mode: null,
            sv_skill_level: null,
            sv_respawn_delay_tdm: null,
            sv_teamdamage: null,
            sv_powerups: null,
            sv_vote_kick: null,
            sv_vote_kick_bantime: null,
            sv_vote_kick_min: null,
            sv_inactivekick_time: null,
            sv_inactivekick: null,
            sv_vote_spectate: null,
            sv_vote_spectate_rejoindelay: null, // number
        };
    }
}
exports.TwServerState = TwServerState;
