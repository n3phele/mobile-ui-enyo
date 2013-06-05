package com.example.other;
import org.apache.cordova.*;


import android.os.Bundle;
import android.app.Activity;
import android.content.res.Configuration;
import android.graphics.drawable.Drawable;

import com.google.ads.*;
import android.view.Menu;
import android.widget.LinearLayout;
import android.widget.Toast;

public class MainActivity extends DroidGap {
	private static final String AdMob_Ad_Unit = "a151486bf0b55b1";
	private AdView adView;
	
	
	@Override
	public void onCreate(Bundle savedInstanceState) {	
		
		super.onCreate(savedInstanceState);
		super.loadUrl("file:///android_asset/www/index.html");		
		
		/** ADmob**/
		adView = new AdView(this, AdSize.BANNER, AdMob_Ad_Unit); 
		LinearLayout layout = super.root;  
		layout.addView(adView); 
		adView.loadAd(new AdRequest());		
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.activity_main, menu);
		return true;
	}
	
	@Override
	public void onConfigurationChanged(Configuration newConfig) {
	    super.onConfigurationChanged(newConfig);

	    // Checks the orientation of the screen
	    if (newConfig.orientation == Configuration.ORIENTATION_LANDSCAPE) {
	        Toast.makeText(this, "landscape", Toast.LENGTH_SHORT).show();
	    } else if (newConfig.orientation == Configuration.ORIENTATION_PORTRAIT){
	        Toast.makeText(this, "portrait", Toast.LENGTH_SHORT).show();
	    }
	}

}
