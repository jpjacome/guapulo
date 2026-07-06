// Shared event-data derivation. Single source of truth: _data/event-config.json
// Everything displayable (dates, times, meta descriptions) is DERIVED here from
// config.event.date + config.event.time so they can never drift apart.
// Used by build.js (site generation) and netlify/functions (emails).

const TIME_ZONE = 'America/Guayaquil'; // UTC-05, no DST

function stripAccents(str) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function esFormat(date, options) {
  return new Intl.DateTimeFormat('es-EC', { timeZone: TIME_ZONE, ...options }).format(date);
}

/**
 * Derive all display values from the config.
 * @param {object} config parsed event-config.json
 * @returns {object} derived strings
 */
function deriveEventInfo(config) {
  const { date, time, timezone_offset } = config.event;
  const offset = timezone_offset || '-05:00';
  const iso = `${date}T${time}:00${offset}`;
  const eventDate = new Date(iso);
  if (isNaN(eventDate.getTime())) {
    throw new Error(`Invalid event date/time in event-config.json: ${iso}`);
  }

  const weekday = esFormat(eventDate, { weekday: 'long' });   // "sábado"
  const dayNum = esFormat(eventDate, { day: 'numeric' });     // "25"
  const monthName = esFormat(eventDate, { month: 'long' });   // "abril"
  const dd = esFormat(eventDate, { day: '2-digit' });         // "25"
  const mm = esFormat(eventDate, { month: '2-digit' });       // "04"

  // 12h display time from "HH:MM"
  const [h24, min] = time.split(':').map(Number);
  const ampm = h24 >= 12 ? 'pm' : 'am';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const displayTime = `${h12}:${String(min).padStart(2, '0')} ${ampm}`;       // "5:00 pm"
  const compactTime = min === 0 ? `${h12}${ampm}` : `${h12}:${String(min).padStart(2, '0')}${ampm}`; // "5pm"

  return {
    isoDateTime: iso,                                              // "2026-04-25T17:00:00-05:00"
    shortDate: `${stripAccents(weekday).toUpperCase()} ${dd}/${mm}`, // "SABADO 25/04"
    longDateEs: `${weekday} ${dayNum} de ${monthName}`,            // "sábado 25 de abril"
    displayTime,                                                   // "5:00 pm"
    compactTime,                                                   // "5pm"
    seoDescription: `${dayNum} de ${monthName}, ${compactTime}`    // "25 de abril, 5pm"
  };
}

module.exports = { deriveEventInfo, stripAccents };
