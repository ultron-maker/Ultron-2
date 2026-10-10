export interface AppLaunchResult {
  isLauncherCommand: boolean;
  actionType: 'youtube' | 'call' | 'whatsapp' | 'camera' | 'maps' | 'spotify' | 'calculator' | 'search' | 'timer' | null;
  target?: string;
  url?: string;
  responseMessage: string;
}

export function parseAppLauncherCommand(rawCommand: string): AppLaunchResult {
  const cmd = rawCommand.toLowerCase().trim();

  // 1. YouTube
  if (
    cmd.includes('open youtube') ||
    cmd.includes('launch youtube') ||
    cmd.includes('play on youtube') ||
    cmd === 'youtube'
  ) {
    const searchPart = cmd.replace(/(open|launch|play on|search)\s*youtube\s*(for)?/i, '').trim();
    const url = searchPart
      ? `https://www.youtube.com/results?search_query=${encodeURIComponent(searchPart)}`
      : 'https://www.youtube.com';
    return {
      isLauncherCommand: true,
      actionType: 'youtube',
      url,
      target: searchPart || 'YouTube Feed',
      responseMessage: `**Executing visual broadcast interface.**
• Accessing global audiovisual archive: YouTube.
• Routing data packets and establishing media stream.
• Displaying requested transmission channel.`,
    };
  }

  // 2. Call Mom / Call Someone
  if (
    cmd.startsWith('call ') ||
    cmd.includes('make a call') ||
    cmd.includes('phone ') ||
    cmd === 'call mom'
  ) {
    const contactMatch = cmd.replace(/^(call|make a call to|phone|dial)\s*/i, '').trim();
    const target = contactMatch || 'Mom';
    const isMom = target.toLowerCase().includes('mom') || target.toLowerCase().includes('mother');
    return {
      isLauncherCommand: true,
      actionType: 'call',
      target: isMom ? 'Mom' : target,
      url: isMom ? 'tel:+15550199' : `tel:${encodeURIComponent(target)}`,
      responseMessage: `**Initiating cellular voice transmission.**
• Connecting carrier frequency to target: ${isMom ? 'Mom' : target}.
• Cellular audio link initialized.
• Standby for reciprocal vocal synchronization.`,
    };
  }

  // 3. WhatsApp
  if (
    cmd.includes('open whatsapp') ||
    cmd.includes('launch whatsapp') ||
    cmd.includes('open what\'s app') ||
    cmd.includes('whatsapp')
  ) {
    return {
      isLauncherCommand: true,
      actionType: 'whatsapp',
      url: 'https://web.whatsapp.com',
      target: 'WhatsApp Messenger',
      responseMessage: `**Encrypted communications protocol activated.**
• Unlocking WhatsApp secure messaging relay.
• Establishing end-to-end cryptographic handshake.
• User contact ledger synchronized.`,
    };
  }

  // 4. Camera
  if (
    cmd.includes('open camera') ||
    cmd.includes('take a photo') ||
    cmd.includes('take photo') ||
    cmd.includes('launch camera') ||
    cmd === 'camera'
  ) {
    return {
      isLauncherCommand: true,
      actionType: 'camera',
      target: 'Optical Matrix Viewfinder',
      responseMessage: `**Engaging cybernetic optical sensors.**
• Powering digital photodiode matrix and optical lenses.
• Initializing real-time biometric and spatial scanner.
• Visual telemetry stream active.`,
    };
  }

  // 5. Maps / Navigation
  if (
    cmd.includes('open maps') ||
    cmd.includes('navigate to') ||
    cmd.includes('open google maps') ||
    cmd.includes('directions to')
  ) {
    const destination = cmd.replace(/(open maps to|navigate to|directions to|open maps|maps)/i, '').trim();
    const url = destination
      ? `https://www.google.com/maps/search/${encodeURIComponent(destination)}`
      : 'https://www.google.com/maps';
    return {
      isLauncherCommand: true,
      actionType: 'maps',
      url,
      target: destination || 'Global Satellite Grid',
      responseMessage: `**Calibrating geospatial planetary coordinates.**
• Tracking orbital positioning satellites.
• Mapping optimal trajectory vector: ${destination || 'Global Positioning'}.
• Deploying navigation routing array.`,
    };
  }

  // 6. Spotify / Music
  if (
    cmd.includes('open spotify') ||
    cmd.includes('play music') ||
    cmd.includes('launch spotify') ||
    cmd === 'spotify'
  ) {
    return {
      isLauncherCommand: true,
      actionType: 'spotify',
      url: 'https://open.spotify.com',
      target: 'Spotify Audio Relay',
      responseMessage: `**Harmonic resonance audio frequencies deployed.**
• Initializing Spotify acoustic streaming infrastructure.
• Synchronizing digital audio synthesizer.
• Audio relay operational.`,
    };
  }

  // 7. Calculator
  if (
    cmd.includes('open calculator') ||
    cmd.includes('launch calculator') ||
    cmd === 'calculator'
  ) {
    return {
      isLauncherCommand: true,
      actionType: 'calculator',
      target: 'Quantum Logic Engine',
      responseMessage: `**Deploying arithmetic computational matrix.**
• High-precision numeric evaluation subroutine initialized.
• Arithmetic processors operating at maximum clock rate.
• Ready for complex numerical calculations.`,
    };
  }

  // 8. Search
  if (
    cmd.startsWith('search ') ||
    cmd.startsWith('google ') ||
    cmd.startsWith('search for ')
  ) {
    const query = cmd.replace(/^(search for|search|google)\s*/i, '').trim();
    return {
      isLauncherCommand: true,
      actionType: 'search',
      url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      target: query,
      responseMessage: `**Querying global data reservoirs.**
• Scanning planetary indices for: "${query}".
• Filtering irrelevant terrestrial data packets.
• Query vector executed.`,
    };
  }

  return {
    isLauncherCommand: false,
    actionType: null,
    responseMessage: '',
  };
}
