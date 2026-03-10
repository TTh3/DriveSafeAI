/**
 * avInference.js
 * 
 * Maps Google Maps DirectionsStep instructions (HTML) into educational 
 * autonomous driving safety tips and specific rule links.
 */

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').trim();
}

/**
 * Returns specific handbook deep links based on the active country and the maneuver type.
 * Note: These are example deep-links. Handbooks change, but this demonstrates the dynamic rule linking mapping.
 */
function getRuleLink(countryCode, maneuverKey) {
  const rules = {
    AU: { // South Australia
      roundabout: { url: 'https://mylicence.sa.gov.au/road-rules/the-drivers-handbook/roundabouts', name: 'Roundabouts', desc: 'When entering a roundabout, give way to any vehicle already in the roundabout.' },
      merge: { url: 'https://mylicence.sa.gov.au/road-rules/the-drivers-handbook/giving-way', name: 'Merging & Giving Way', desc: 'When lanes merge, you must give way to the vehicle ahead or in the lane you are moving into.' },
      turn: { url: 'https://mylicence.sa.gov.au/road-rules/the-drivers-handbook/turning', name: 'Turning', desc: 'Indicate your intention to turn for an adequate distance, and give way to pedestrians and oncoming traffic.' },
      default: { url: 'https://mylicence.sa.gov.au/road-rules/the-drivers-handbook', name: "Driver's Handbook", desc: 'Ensure you follow all posted signs, signals, and speed limits on the road.' }
    },
    US: { // California DMV
      roundabout: { url: 'https://www.dmv.ca.gov/portal/handbook/california-driver-handbook/navigating-the-roads/#roundabouts', name: 'Roundabouts', desc: 'Yield to traffic already in the roundabout. Enter to the right and merge when safe.' },
      merge: { url: 'https://www.dmv.ca.gov/portal/handbook/california-driver-handbook/navigating-the-roads/#merging', name: 'Merging', desc: 'Match the speed of traffic and use your mirrors to find a safe gap before merging.' },
      turn: { url: 'https://www.dmv.ca.gov/portal/handbook/california-driver-handbook/navigating-the-roads/#turning', name: 'Turning', desc: 'Signal at least 100 feet before turning. Yield to oncoming traffic and pedestrians.' },
      default: { url: 'https://www.dmv.ca.gov/portal/handbook/california-driver-handbook/', name: "Driver Handbook", desc: 'Drive safely, responsibly, and obey all traffic control devices.' }
    },
    GB: { // UK Highway Code
      roundabout: { url: 'https://www.gov.uk/guidance/the-highway-code/using-the-road-159-to-203#roundabouts-184-to-190', name: 'Roundabouts', desc: 'Give priority to traffic approaching from your right, unless directed otherwise by signs.' },
      merge: { url: 'https://www.gov.uk/guidance/the-highway-code/motorways-253-to-273#joining-the-motorway-259-to-260', name: 'Joining & Merging', desc: 'Match your speed to fit safely into the traffic flow in the left-hand lane.' },
      turn: { url: 'https://www.gov.uk/guidance/the-highway-code/using-the-road-159-to-203#turning', name: 'Turning', desc: 'Check mirrors, signal, and position yourself correctly. Give way to pedestrians on the road you are turning into.' },
      default: { url: 'https://www.gov.uk/browse/driving/highway-code-road-safety', name: "Highway Code", desc: 'Be considerate to other road users and follow the Highway Code at all times.' }
    },
    JP: { // Japan
      roundabout: { url: 'https://english.jaf.or.jp/driving-in-japan/rules-of-the-road/intersections', name: 'Intersections', desc: 'Enter rotating intersections cautiously and yield to vehicles already circulating.' },
      merge: { url: 'https://english.jaf.or.jp/driving-in-japan/rules-of-the-road/traffic-rules', name: 'Merging', desc: 'Accelerate smoothly to match the speed of the main lane and merge securely without obstructing traffic.' },
      turn: { url: 'https://english.jaf.or.jp/driving-in-japan/rules-of-the-road/intersections', name: 'Turning', desc: 'When turning left or right, yield to pedestrians and oncoming vehicles.' },
      default: { url: 'https://english.jaf.or.jp/driving-in-japan/rules-of-the-road', name: 'Rules of the Road', desc: 'Always keep strictly to the left and abide by all road signs and markings.' }
    },
    DE: { // Germany / EU
      roundabout: { url: 'https://euagenda.eu/upload/publications/untitled-96809-ea.pdf', name: 'Roundabouts', desc: 'Traffic in the roundabout has right of way. Do not indicate when entering, only when exiting.' },
      merge: { url: 'https://euagenda.eu/upload/publications/untitled-96809-ea.pdf', name: 'Zipper Merge', desc: 'Use the zipper method (Reißverschlussverfahren) to merge smoothly when a lane ends.' },
      turn: { url: 'https://euagenda.eu/upload/publications/untitled-96809-ea.pdf', name: 'Turning', desc: 'Check over your shoulder for cyclists before turning right. Yield to oncoming traffic when turning left.' },
      default: { url: 'https://euagenda.eu/upload/publications/untitled-96809-ea.pdf', name: 'European Handbook', desc: 'Adapt your speed to visibility, weather, and traffic conditions. Drive defensively.' }
    }
  };

  const cRules = rules[countryCode] || rules['US'];
  return cRules[maneuverKey] || cRules['default'];
}


/**
 * Given a raw Google Maps instruction string, returns a contextual safety driving tip.
 */
export function getDrivingFeedback(rawInstruction, countryCode = 'US') {
  if (!rawInstruction) return null;

  const text = stripHtml(rawInstruction);
  const lowerText = text.toLowerCase();

  let tip = "Maintain a safe following distance and stay centred in your lane.";
  let title = "Following Lane";
  let icon = "⬆";
  let maneuverKey = 'default';

  if (lowerText.includes('turn right')) {
    title = "Turning Right";
    icon = "↪";
    tip = "Check your mirrors and blind spots. Signal right for at least 3 seconds before initiating the turn. Yield to any pedestrians crossing the intersection.";
    maneuverKey = 'turn';
  } 
  else if (lowerText.includes('turn left')) {
    title = "Turning Left";
    icon = "↩";
    tip = "Check mirrors and signal early. When making a turn across oncoming traffic, wait for a fully clear gap before proceeding. Do not cut the corner.";
    maneuverKey = 'turn';
  } 
  else if (lowerText.includes('roundabout')) {
    title = "Roundabout Ahead";
    icon = "🔄";
    tip = "Slow down on approach. Yield to traffic already circulating. Choose the correct lane early and signal your exit.";
    maneuverKey = 'roundabout';
  } 
  else if (lowerText.includes('keep right')) {
    title = "Keeping Right";
    icon = "↗";
    tip = "Maintain your speed while merging right. Ensure you have checked your right blind spot if changing lanes.";
    maneuverKey = 'merge';
  } 
  else if (lowerText.includes('keep left')) {
    title = "Keeping Left";
    icon = "↖";
    tip = "Maintain your speed while merging left. Check your left blind spot and use your indicators clearly.";
    maneuverKey = 'merge';
  } 
  else if (lowerText.includes('merge')) {
    title = "Merging";
    icon = "🔀";
    tip = "Match the speed of the traffic you are merging into. Use your indicator and find a safe gap before smoothly changing lanes.";
    maneuverKey = 'merge';
  }
  else if (lowerText.includes('head')) {
    title = "Heading Out";
    icon = "🛣";
    tip = "Accelerate smoothly to the speed limit. Scan the road far ahead to anticipate upcoming hazards.";
  }
  else if (lowerText.includes('destination')) {
    title = "Approaching Destination";
    icon = "🏁";
    tip = "Slow down smoothly. Look for a safe parking spot and ensure you do not block traffic when stopping.";
  }

  const ruleData = getRuleLink(countryCode, maneuverKey);

  return {
    rawInstruction: text,
    title,
    icon,
    tip,
    ruleUrl: ruleData.url,
    ruleName: ruleData.name,
    ruleDesc: ruleData.desc
  };
}
